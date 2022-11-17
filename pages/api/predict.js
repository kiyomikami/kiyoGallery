export default async function handler(req, res) {
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, reject) => {
    const { query } = req.query
    if (!query || query === '') {
      res.status(400).send('No query provided')
      return resolve()
    } else {
      fetch(`https://rule34.xxx/autocomplete.php?q=${query}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
          cookie:
            '_ga=GA1.2.2068102279.1645218566; gdpr=1; user_id=1619579; pass_hash=84bcccb5bf6f2840035f25066d4e3cd31100a478; _gid=GA1.2.535379605.1645838770',
          'access-control-allow-origin': '*',
        },
      })
        .catch((err) => {
          console.log(err)
          res.status(500).send('Internal server error')
          return resolve()
        })
        .then((r) => {
          if (r.status !== 200) {
            res.status(500).send('Internal server error')
            return resolve()
          }
          r.json()
            .then((data) => {
              res.send(data)
              return resolve()
            })
            .catch((err) => {
              console.log(err)
              res.status(500).send('Internal server error')
              return resolve()
            })
        })
    }
  })
}
