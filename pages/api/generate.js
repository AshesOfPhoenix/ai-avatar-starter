const bufferToBase64 = (buffer) => {
  let arr = new Uint8Array(buffer);
  const base64 = btoa(
    arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
  )
  return `data:image/png;base64,${base64}`;
};

const generateAction = async (req, res) => {
    console.log('Received request')

    console.log(req.body)

    const input = JSON.parse(req.body).input;

    console.log(input)

    // For debuggin:
    //res.status(20).json(input);
    //return;

    const response = await fetch(`https://api-inference.huggingface.co/models/AshesOfPhoenix/sd-1-5-kiko`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HF_AUTH_KEY}`,
          'x-use-cache': 'false'
          //'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      }
    );

    //console.log(response)

    if (response.ok) {
      const buffer = await response.arrayBuffer();
      const base64 = bufferToBase64(buffer);
      // Make sure to change to base64
      res.status(200).json({ image: base64 });
      console.log(buffer)
      res.status(200).json({ image: buffer });
    } else if (response.status === 503) {
      const json = await response.json();
      res.status(503).json(json);
    } else {
      console.log('Neki ne dela lmao')
      const json = await response.json();
      res.status(response.status).json({ error: response.statusText });
    }
  };

  
export default generateAction;