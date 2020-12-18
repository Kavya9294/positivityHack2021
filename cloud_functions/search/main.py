import pymongo
from bson.json_util import dumps

client = pymongo.MongoClient("mongodb+srv://hack2021:hack2021@newscluster.agzjw.mongodb.net/NewsData?retryWrites=true&w=majority")

def hello_world(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
    request_json = request.get_json()
    query = None
    if request.args and 'query' in request.args:
        query = request.args.get('query')
    elif request_json and 'query' in request_json:
        query = request_json['query']

    if query:
        # Requires the PyMongo package.
        # https://api.mongodb.com/python/current

        result = client['NewsData']['NewsData'].aggregate([
                                                            {
                                                                '$search': {
                                                                    'text': {
                                                                        'query': query, 
                                                                        'path': 'title'
                                                                    }
                                                                }
                                                            }, {
                                                                '$sort': {
                                                                    '_id': -1
                                                                }
                                                            }, {
                                                                '$limit': 50
                                                            }
                                                        ])
    else:
        result = client['NewsData']['NewsData'].find(limit=50).sort("_id", -1)
    
    return dumps(list(result)), 200, {'Content-Type': 'application/json'}