import yfinance as yf
asset='US100'
update='5m'
time='60d'
tags={'US500':'^GSPC','DAX':'^GDAXI','US100':'^IXIC','BTC':'BTC-USD','ETH':'ETH-USD','EURUSD':'EURUSD=X'}
if asset in tags: tag=tags[asset]
else: tag=asset
ydata = yf.download(tickers=tag, period=time, interval=update)
n=len(ydata['Open'])
if n==0:
    print('no data')
    exit()
day=''
data=[]
for i in range(n):
    quoteDay=str(ydata.index[i])[:10]
    if quoteDay!=day:
        day=quoteDay
        p=100/ydata['Open'][i]
        dayData=[]
        data.append(dayData)
    dayData.append([ydata['Open'][i]*p,ydata['Close'][i]*p,ydata['High'][i]*p,ydata['Low'][i]*p])
with open('data.js','w') as f:
    f.write('document.getElementById(\'chartInfo\').innerHTML=\''+asset+' '+update+'\';\nconst data = '+str(data)+';')
print('data downloaded')