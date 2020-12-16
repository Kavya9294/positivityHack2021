from bs4 import BeautifulSoup
import re
import torch
from transformers import RobertaForSequenceClassification, RobertaTokenizer
from google.cloud import language_v1


class FakeNewsDetector:
    def __init__(self):
        self.tokenizer = RobertaTokenizer.from_pretrained("roberta-base")
        self.model = RobertaForSequenceClassification.from_pretrained("ghanashyamvtatti/roberta-fake-news")
        self.softmax_fn = torch.nn.Softmax(dim=1)
        self.client = language_v1.LanguageServiceClient()

    def denoise_text(self, text):
        def _strip_html(text):
            soup = BeautifulSoup(text, "html.parser")
            return soup.get_text()

        def _remove_between_square_brackets(text):
            return re.sub(r'http\S+', '', text)

        text = _strip_html(text)
        text = _remove_between_square_brackets(text)
        text = text.replace('\n', ' ')
        return text.lower()

    def get_sentiment(self, text):
        document = language_v1.Document(content=text, type_=language_v1.Document.Type.PLAIN_TEXT)
        sentiment = self.client.analyze_sentiment(request={'document': document}).document_sentiment
        return sentiment

    def get_trust_score(self, txt):
        encoded_txt = self.tokenizer(txt, truncation=True, padding=True, return_tensors='pt')
        output = self.model(encoded_txt['input_ids'])
        op = self.softmax_fn(output.logits).tolist()[0]
        score = op[1] / (op[0] + op[1]) * 100
        return score

    def get_scores(self, text):
        text = self.denoise_text(text).strip()
        sentiment = self.get_sentiment(text)
        trust = self.get_trust_score(text)
        return {"sentiment": {"score": sentiment.score, "magnitude": sentiment.magnitude}, "trust_score": trust}

detector = FakeNewsDetector()


def entry_point(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """

    request_json = request.get_json()
    if request.args and 'text' in request.args:
        text = request.args.get('text')
    elif request_json and 'text' in request_json:
        text = request_json['text']
    else:
        return 500, 'No text specified'

    return detector.get_scores(text)
