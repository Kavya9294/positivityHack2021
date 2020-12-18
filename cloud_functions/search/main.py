import time;
import json
import requests
from newsplease import NewsPlease

feedDict = []

currTimeUnix = int(time.time())
unix1Day = 86400 
unixTime1DayAgo = currTimeUnix - unix1Day
numTopicsRequested = 10

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
    numArticlesRequested = 3

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
        tmpDict = {"title":article.title, "url":article.url, "text":article.maintext}
        feedDict.append(tmpDict)

print(feedDict[0])
with open("feedDict_0.json", "w") as outfile:  
    json.dump(feedDict[0], outfile)
