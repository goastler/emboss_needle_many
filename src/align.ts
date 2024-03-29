
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

const submit = async (a: string, b: string) => {
    const res = await fetch("https://www.ebi.ac.uk/Tools/services/rest/emboss_needle/run", {
        "headers": {
          "accept": "application/json, text/plain, */*",
          "accept-language": "en-GB,en;q=0.5",
          "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryXu7txv8TklTc2eS7",
          "sec-ch-ua": "\"Not A(Brand\";v=\"99\", \"Brave\";v=\"121\", \"Chromium\";v=\"121\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Linux\"",
          "sec-gpc": "1",
          "Referer": "https://www.ebi.ac.uk/jdispatcher/psa/emboss_needle",
        },
        "body": `------WebKitFormBoundaryXu7txv8TklTc2eS7\r\nContent-Disposition: form-data; name=\"program\"\r\n\r\nneedle\r\n------WebKitFormBoundaryXu7txv8TklTc2eS7\r\nContent-Disposition: form-data; name=\"version\"\r\n\r\n6.6.0\r\n------WebKitFormBoundaryXu7txv8TklTc2eS7\r\nContent-Disposition: form-data; name=\"asequence\"\r\n\r\n${a}\r\n------WebKitFormBoundaryXu7txv8TklTc2eS7\r\nContent-Disposition: form-data; name=\"bsequence\"\r\n\r\n${b}\r\n------WebKitFormBoundaryXu7txv8TklTc2eS7\r\nContent-Disposition: form-data; name=\"stype\"\r\n\r\ndna\r\n------WebKitFormBoundaryXu7txv8TklTc2eS7\r\nContent-Disposition: form-data; name=\"format\"\r\n\r\npair\r\n------WebKitFormBoundaryXu7txv8TklTc2eS7\r\nContent-Disposition: form-data; name=\"matrix\"\r\n\r\nEDNAFULL\r\n------WebKitFormBoundaryXu7txv8TklTc2eS7\r\nContent-Disposition: form-data; name=\"gapopen\"\r\n\r\n10\r\n------WebKitFormBoundaryXu7txv8TklTc2eS7\r\nContent-Disposition: form-data; name=\"gapext\"\r\n\r\n0.5\r\n------WebKitFormBoundaryXu7txv8TklTc2eS7\r\nContent-Disposition: form-data; name=\"endweight\"\r\n\r\nfalse\r\n------WebKitFormBoundaryXu7txv8TklTc2eS7\r\nContent-Disposition: form-data; name=\"endopen\"\r\n\r\n10\r\n------WebKitFormBoundaryXu7txv8TklTc2eS7\r\nContent-Disposition: form-data; name=\"endextend\"\r\n\r\n0.5\r\n------WebKitFormBoundaryXu7txv8TklTc2eS7\r\nContent-Disposition: form-data; name=\"toolId\"\r\n\r\nemboss_needle\r\n------WebKitFormBoundaryXu7txv8TklTc2eS7\r\nContent-Disposition: form-data; name=\"email\"\r\n\r\nwp-angular-web@ebi.ac.uk\r\n------WebKitFormBoundaryXu7txv8TklTc2eS7\r\nContent-Disposition: form-data; name=\"title\"\r\n\r\nEMBOSS Needle's job\r\n------WebKitFormBoundaryXu7txv8TklTc2eS7--\r\n`,
        "method": "POST"
      });
    if(res.status !== 200) throw new Error(`got status ${res.status} from run endpoint: ${await res.text()}`)
    const data = await res.text()
    return data
}

const result = async (id: string): Promise<string> => {
    const url = `https://www.ebi.ac.uk/Tools/services/rest/emboss_needle/result/${id}/out`
    const options = {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-GB,en;q=0.5",
            "sec-ch-ua": "\"Not A(Brand\";v=\"99\", \"Brave\";v=\"121\", \"Chromium\";v=\"121\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Linux\"",
            "sec-gpc": "1",
            "Referer": "https://www.ebi.ac.uk/jdispatcher/psa/emboss_needle/summary?jobId=emboss_needle-I20240202-104914-0356-44799083-p1m",
        },
        "body": null,
        "method": "GET"
    }
    let res = {status: -1} as Response
    let i = 0
    const intervalSecs = 3
    while(res.status !== 200) {
        await new Promise(r => setTimeout(r, intervalSecs * 1000))
        try {
            res = await fetch(url, options);
        } catch(e) {
            // discard
            console.log('error fetching result', e)
        }
        i++
    }
    const data = await res.text()
    return data
}

const detectSequences = (bsInput: string) => {
    const bs: string[] = []
    const lines = bsInput.split('\n').map(l => l.trim()).filter(l => l.length > 0)
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
    return bs
}

export interface Input {
    aSeqs: string;
    bSeqs: string;
}

export interface Output {
    out: string;
    aSeq: string;
    bSeq: string;
    key: number;
}

export const run = (input: Input): Promise<Output>[] => {
    // remove empty sequences
    const aSeqs = detectSequences(input.aSeqs)
    const bSeqs = detectSequences(input.bSeqs)

    const proms: Promise<Output>[] = []
    for(let i = 0, k = 0; i < aSeqs.length; i++) {
        for(let j = 0; j < bSeqs.length; j++, k++) {
            const a = aSeqs[i]
            const b = bSeqs[j]
            const key = k
            proms.push(new Promise(async (resolve, reject) => {
                try {
                    const id = await submit(a, b)
                    let out = (await result(id))//.replace(/ /g, '\u00a0').replace(/\n/g, '\u000a')
                    resolve({out, aSeq: a, bSeq: b, key})
                } catch(e) {
                    reject(e)
                }
            }))
        }
    }
    return proms
}