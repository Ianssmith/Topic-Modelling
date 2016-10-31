import urllib.request 
from bs4 import BeautifulSoup as bs4
import re
import datetime
import random
from urllib.error import HTTPError
from urllib.error import URLError
from http.cookiejar import CookieJar

cj = CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

random.seed(datetime.datetime.now())


def getLinks(urlpath):
	try:
		html=opener.open("https://en.wikipedia.org"+urlpath)
	except HTTPError as e:
		print(e)
	except URLError as e:
		print("Server could not be found.")
	try:
		soup=bs4(html.read())
		text=soup.get_text()
		links=soup.find("div", {"id":"bodyContent"}).find_all("a",href=re.compile("^(/wiki/)((?!:).)*$"))
	except AttributeError as e:
		return None
	print(text)
	return links

links=getLinks("/wiki/42_(number)")
if links==None:
	print("no links here..")
else:
	while len(links)>0:
		print("_____")
		nextArticle = links[random.randint(0,len(links)-1)].attrs["href"]
		print(nextArticle)
		links = getLinks(nextArticle)


