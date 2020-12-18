import time
import json
import requests
from newsplease import NewsPlease
import pymongo
import requests

def get_scores(text):
    response = requests.post("https://us-central1-trans-campus-298823.cloudfunctions.net/score",
        headers={'Content-Type': 'application/json'},
        data=json.dumps({'text': text}))
    return response.json()

def bulk_insert(data):
    client = pymongo.MongoClient("mongodb+srv://hack2021:hack2021@newscluster.agzjw.mongodb.net/NewsData?retryWrites=true&w=majority")
    client['NewsData']['NewsData'].insert_many(data)

def request_handler(request):
    daysOld = 1
    numTopicsRequested = 10
    numArticlesRequested = 3
    if request.args:
        if 'daysOld' in request.args:
            daysOld = int(request.args.get('daysOld'))
        if 'numTopicsRequested' in request.args:
            numTopicsRequested = int(request.args.get('numTopicsRequested'))
        if 'numArticlesRequested' in request.args:
            numArticlesRequested = int(request.args.get('numArticlesRequested'))
    
    fetch_news(daysOld, numTopicsRequested, numArticlesRequested)

    return "Success", 200
    

def fetch_news(daysOld=1, numTopicsRequested=10, numArticlesRequested = 3):
    feedDict = []

    currTimeUnix = int(time.time())
    unix1Day = daysOld * 86400 
    unixTime1DayAgo = currTimeUnix - unix1Day

    url = "https://bing-news-search1.p.rapidapi.com/news/trendingtopics"

    sinceTimeUnix = str(unixTime1DayAgo)
    querystring = {"textFormat":"Raw","safeSearch":"Off","since":sinceTimeUnix,"count":numTopicsRequested}
    headers = {
        'x-bingapis-sdk': "true",
        'x-rapidapi-key': "55fcf9d423mshf8e158a5b045b42p1ca4e7jsn22ce0249fe51",
        'x-rapidapi-host': "bing-news-search1.p.rapidapi.com"
        }

    response = requests.request("GET", url, headers=headers, params=querystring)

    topTopicsDict = json.loads(response.text)
    for hotTopic in topTopicsDict['value']:
        query = hotTopic['name']
        

        url = "https://bing-news-search1.p.rapidapi.com/news/search"

        querystring = {"q":query,"count":numArticlesRequested,"freshness":"Day","textFormat":"Raw","safeSearch":"Off"}

        headers = {
            'x-bingapis-sdk': "true",
            'x-rapidapi-key': "55fcf9d423mshf8e158a5b045b42p1ca4e7jsn22ce0249fe51",
            'x-rapidapi-host': "bing-news-search1.p.rapidapi.com"
            }

        response = requests.request("GET", url, headers=headers, params=querystring)

        articlesDict = json.loads(response.text)

        for article in articlesDict['value']:
            articleUrl = article['url']
            try:
                article = NewsPlease.from_url(articleUrl, timeout=3)
            except :
                print('caught error when scraping url: ' + articleUrl + '. \ncontinuing...')
                continue
            if article.maintext:
                tmpDict = {"title":article.title, "url":article.url, "sentiment": get_scores(article.maintext)}
                feedDict.append(tmpDict)
    bulk_insert(feedDict)
