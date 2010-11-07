import datetime

DB_DATETIME_FORMAT = "%Y-%m-%dT%H:%M:%SZ"
URL_DATETIME_FORMAT = "%Y-%m-%d-%H-%M-%S"
DISPLAY_DATETIME_FORMAT = "%Y-%m-%d %H:%M:%S"

def getDbDateFromUrlDate(urlDate):
     date = datetime.datetime.strptime(urlDate, URL_DATETIME_FORMAT)
     return date.strftime(DB_DATETIME_FORMAT)

