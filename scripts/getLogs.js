document.addEventListener( "DOMContentLoaded", async () => {
  const token = await getToken()
  const dates = await getDate( token )
  let datesHTML = document.getElementById( 'dateSelector' )
  for( const date of dates ) {
    const domDate = createDate( date )
    datesHTML.appendChild( domDate )
  }
  doLogs()
} )

let doLogs = async () => 
{
  const token = await getToken()
  let date = document.getElementById( 'dateSelector' )
  date = date.value
  let type = document.getElementById( 'typeSelectorValue' )
  type = type.value
  let logs = await getLogs( token, date )
  let logsHTML = document.getElementById( 'logs' )
  while (logsHTML.firstChild) {
    logsHTML.removeChild(logsHTML.firstChild);
  }
  if (type == 'all') {
    for( const log of logs ) {
      const domLog = createLog( log )
      logsHTML.appendChild( domLog )
    }
  } else {
    for( const log of logs ) {
      if (type == log.logType) {
        const domLog = createLog( log )
        logsHTML.appendChild( domLog )
      }
    }
  }
}

let dateSelector = document.getElementById('dateSelector')
dateSelector.addEventListener( "change", doLogs )

let typeSelector = document.getElementById('typeSelector')
typeSelector.addEventListener( "change", doLogs )

const getDate = async ( token ) => {
  let response = await fetch(`http://web-code-developers.tk:4000/log/getDates?token=${token}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
  } )
  const data = await response.json()
  return data
}

const getToken = async () => {
  let response = await fetch('http://web-code-developers.tk:4000/log/getToken?password=fskht0sdjg', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
  } )
  const data = await response.json()
  return data
}

const getLogs = async ( token, date ) => {
  let response = await fetch(`http://web-code-developers.tk:4000/log/getLogs?token=${token}&logDate=${date}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
  } )
  const data = await response.json()
  return data
}

const createLog = ( log ) => {
  let logHtmlString = ''
  if( log.stack != '') {
    logHtmlString = `
    <div class="log_block_${log.logType}">
      <div class="table">
          <div class = "logType">${log.logType}</div>
          <div class = "message">
          ${log.message}<br>
          <details>
            <summary>stack</summary>
            <p>${log.stack}</p>
          </details>
          </div>
          <div class = "logData ">${log.logDate}</div>
          <div class = "logTime">${log.logTime}</div>
        </div>
    </div>
    `
  } else {
    logHtmlString = `
    <div class="log_block_${log.logType}">
      <div class="table">
          <div class = "logType">${log.logType}</div>
          <div class = "message">${log.message}</div>
          <div class = "logData ">${log.logDate}</div>
          <div class = "logTime">${log.logTime}</div>
        </div>
    </div>
    `
  }
  logHtmlString.replace('\n','<br>')
  return createDomElement( logHtmlString )
}

const createDate = ( date ) => {
  let dateHTMLString = `<option value="${date.logDate}">${date.logDate}</option>`
  return createDomElement( dateHTMLString )
}

const createDomElement = ( html ) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString( html, 'text/html')
  return doc.body.children[ 0 ]
}