// const isFinished = async (id: string): Promise<boolean> => {
//     const res = await fetch("https://www.ebi.ac.uk/Tools/services/rest/emboss_needle/status/emboss_needle-I20240202-104914-0356-44799083-p1m", {
//         "headers": {
//           "accept": "application/json, text/plain, */*",
//           "accept-language": "en-GB,en;q=0.5",
//           "cache-control": "no-cache",
//           "pragma": "no-cache",
//           "sec-ch-ua": "\"Not A(Brand\";v=\"99\", \"Brave\";v=\"121\", \"Chromium\";v=\"121\"",
//           "sec-ch-ua-mobile": "?0",
//           "sec-ch-ua-platform": "\"Linux\"",
//           "sec-fetch-dest": "empty",
//           "sec-fetch-mode": "cors",
//           "sec-fetch-site": "same-origin",
//           "sec-gpc": "1",
//           "Referer": "https://www.ebi.ac.uk/jdispatcher/psa/emboss_needle",
//           "Referrer-Policy": "strict-origin-when-cross-origin"
//         },
//         "body": null,
//         "method": "GET"
//         });
//     if(res.status !== 200) throw new Error(`got status ${res.status} from status endpoint`)
//     const data = await res.text()
//     console.log('status', data, 'for', id)
//     if(data === 'RUNNING') return false
//     if(data === 'FINISHED') return true
//     throw new Error(`unexpected status: ${data}`)
// }

const run = async (a: string, b: string): Promise<string> => {
    const res = await fetch("https://www.ebi.ac.uk/Tools/services/rest/emboss_needle/run", {
        "headers": {
          "accept": "application/json, text/plain, */*",
          "accept-language": "en-GB,en;q=0.5",
          "cache-control": "no-cache",
          "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryXu7txv8TklTc2eS7",
          "pragma": "no-cache",
          "sec-ch-ua": "\"Not A(Brand\";v=\"99\", \"Brave\";v=\"121\", \"Chromium\";v=\"121\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Linux\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "sec-gpc": "1",
          "Referer": "https://www.ebi.ac.uk/jdispatcher/psa/emboss_needle",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": `------WebKitFormBoundaryXu7txv8TklTc2eS7\r\nContent-Disposition: form-data; name=\"program\"\r\n\r\nneedle\r\n------WebKitFormBoundaryXu7txv8TklTc2eS7\r\nContent-Disposition: form-data; name=\"version\"\r\n\r\n6.6.0\r\n------WebKitFormBoundaryXu7txv8TklTc2eS7\r\nContent-Disposition: form-data; name=\"asequence\"\r\n\r\n${a}\r\n------WebKitFormBoundaryXu7txv8TklTc2eS7\r\nContent-Disposition: form-data; name=\"bsequence\"\r\n\r\n${b}\r\n------WebKitFormBoundaryXu7txv8TklTc2eS7\r\nContent-Disposition: form-data; name=\"stype\"\r\n\r\ndna\r\n------WebKitFormBoundaryXu7txv8TklTc2eS7\r\nContent-Disposition: form-data; name=\"format\"\r\n\r\npair\r\n------WebKitFormBoundaryXu7txv8TklTc2eS7\r\nContent-Disposition: form-data; name=\"matrix\"\r\n\r\nEDNAFULL\r\n------WebKitFormBoundaryXu7txv8TklTc2eS7\r\nContent-Disposition: form-data; name=\"gapopen\"\r\n\r\n10\r\n------WebKitFormBoundaryXu7txv8TklTc2eS7\r\nContent-Disposition: form-data; name=\"gapext\"\r\n\r\n0.5\r\n------WebKitFormBoundaryXu7txv8TklTc2eS7\r\nContent-Disposition: form-data; name=\"endweight\"\r\n\r\nfalse\r\n------WebKitFormBoundaryXu7txv8TklTc2eS7\r\nContent-Disposition: form-data; name=\"endopen\"\r\n\r\n10\r\n------WebKitFormBoundaryXu7txv8TklTc2eS7\r\nContent-Disposition: form-data; name=\"endextend\"\r\n\r\n0.5\r\n------WebKitFormBoundaryXu7txv8TklTc2eS7\r\nContent-Disposition: form-data; name=\"toolId\"\r\n\r\nemboss_needle\r\n------WebKitFormBoundaryXu7txv8TklTc2eS7\r\nContent-Disposition: form-data; name=\"email\"\r\n\r\nwp-angular-web@ebi.ac.uk\r\n------WebKitFormBoundaryXu7txv8TklTc2eS7\r\nContent-Disposition: form-data; name=\"title\"\r\n\r\nEMBOSS Needle's job\r\n------WebKitFormBoundaryXu7txv8TklTc2eS7--\r\n`,
        "method": "POST"
      });
    if(res.status !== 200) throw new Error(`got status ${res.status} from run endpoint: ${await res.text()}`)
    const data = await res.text()
    console.log('id', data)
    return data
}

const result = async (id: string): Promise<string> => {
    const url = `https://www.ebi.ac.uk/Tools/services/rest/emboss_needle/result/${id}/out`
    const options = {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-GB,en;q=0.5",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "sec-ch-ua": "\"Not A(Brand\";v=\"99\", \"Brave\";v=\"121\", \"Chromium\";v=\"121\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "sec-gpc": "1",
            "Referer": "https://www.ebi.ac.uk/jdispatcher/psa/emboss_needle/summary?jobId=emboss_needle-I20240202-104914-0356-44799083-p1m",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
    }
    console.log('url', url)
    let res = await fetch(url, options);
    let i = 0
    while(res.status !== 200 && i < 12) {
        console.log('waiting for result')
        await new Promise(r => setTimeout(r, 5000))
        res = await fetch(url, options);
        i++
    }
    if(res.status !== 200) {
        console.log(res)
        throw new Error(`got status ${res.status} from result endpoint: ${await res.text()}`)
    }
    const data = await res.text()
    const aRes = await fetch(`https://www.ebi.ac.uk/Tools/services/rest/emboss_needle/result/${id}/asequence`, options)
    if(aRes.status !== 200) throw new Error(`got status ${aRes.status} from asequence endpoint: ${await aRes.text()}`)
    const aData = await aRes.text()
    const bRes = await fetch(`https://www.ebi.ac.uk/Tools/services/rest/emboss_needle/result/${id}/bsequence`, options)
    if(bRes.status !== 200) throw new Error(`got status ${bRes.status} from bsequence endpoint: ${await bRes.text()}`)
    const bData = await bRes.text()
    const out = `
SEQUENCE A:
${aData}

SEQUENCE B:
${bData}

RESULT:
${data}
    `
    return out
}

import express, { Request, Response } from 'express';
import path from 'path';

const app = express();
const port = 3001;

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

app.post('/submit', async (req: Request, res: Response) => {
    console.log('body', req.body)
    req.body = req.body || {}
    const left = req.body.left as string
    const right = req.body.right as string
  
    if(typeof left !== 'string') {
        return res.status(400).send('Invalid request body for left');
    }
    if(typeof right !== 'string') {
        return res.status(400).send('Invalid request body for right');
    }
  
    const a = left
    const bs: string[] = []
    const lines = right.split('\n').map(l => l.trim()).filter(l => l.length > 0)
    let appendNext = false
    for(const line of lines) {
        if(appendNext) {
            // append to last element, which should be the line '>blahblahblah'
            bs[bs.length - 1] += '\n'
            bs[bs.length - 1] += line
            appendNext = false
        } else {
            bs.push(line)
            // every time we see a line starting with '>' we should append the next line to the previous one
            appendNext = line[0] === '>'
        }
    }
    console.log('bs', bs.map((b, i) => i + ': ' + b).join('\n'))

    const ps = bs.map(b => run(a, b))
    let i = 0;
    for(const p of ps) {
        i++
        try {
            const id = await p
            try {
                const r = await result(id)
                res.write(r)
                res.write('\n')
                res.write('Progress: ' + i + '/' + bs.length + ' - ' + i/bs.length * 100 + '%' + '\n')
            } catch(e) {
                // failed to get result
                res.write('failed to get result for ' + id + ':' + String(e) + '\n')
            }
        } catch(e) {
            // failed to submit job
            res.write('failed to submit job: ' + String(e) + '\n')
        }
    }
    res.end()
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// const main = async () => {
//     const id = await run('a', 'g')
//     const res = await result(id)
//     console.log(res)
// }

// main()