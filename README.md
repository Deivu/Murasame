# Murasame
<p align="center">
  <img src="https://vignette.wikia.nocookie.net/kancolle/images/7/7b/Murasame_Kai_Ni_Full.png/revision/latest/">
</p>

### A wrapper around MyWaifuList API
[MyWaifuList API](https://mywaifulist.docs.stoplight.io/api-reference)

## Installation?
2 ways to install Murasame.

> 1. `npm i murasame-wrapper`

> 2. `npm i Deivu/Murasame`

## Documentation for Murasame?
You can find it [here](https://deivu.github.io/Murasame/)

## Changes from 1.0.2 to 1.1.0
There is only one simple change, and here it is.
```js
// 1.0.2
const { WaifuList } = require('murasame-wrapper');
const murasame = new WaifuList('token');
// 1.1.0
const { Murasame } = require('murasame-wrapper');
const murasame = new Murasame('token');
```