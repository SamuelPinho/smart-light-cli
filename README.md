# smart-light-cli

Simple script to control smart-light

## How to install and setup

after clonning the repository

`cd <folder_name_containing_cli> && npm install`

> just make sure that you're on the root folder of the project before running the next command

after that run `npm install -g .` in order to install the script in your machine.

now you need to go go `/bin/index.js` and put your light device **id**, **key** and **ip** on `TuyAPI` constructor.

```js
const device = new TuyAPI({
  id: <your_string_id>,
  key: <your_string_key>,
  ip: <your_string_ip>,
  version: 3.3,
});
```

after that, if you run `smart-light` on your terminal and the information that you passed to the constructor is correct, your device will be turned on or off :)

## License

MIT © [Samuel Monteiro](https://samuelmonteiro.netlify.com/)
