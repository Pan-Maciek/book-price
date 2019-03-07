const axios = require('axios')
const readline = require('readline')
const chalk = require('chalk')
const { Spinner } = require('cli-spinner')

const encodeUri = x => encodeURIComponent(x.replace(/\s+/g, '+'))
const avg = arr => Math.floor(arr.reduce((acc, x) => acc + x) / arr.length * 100) / 100

const getInfo = async (title, author) => {
  const url = `https://widget.getbuybox.com/v3/612/buybox.json?name=${encodeUri(title)}&info[]=${encodeUri(author)}&skip_jQuery=1`
  return await axios(url).then(res => Object.values(res.data.data).map(x => +x.price))
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
rl.on('line', async data => {
  const spinner = new Spinner
  spinner.setSpinnerString(1)
  spinner.start()
  const [title, author] = data.split(';').map(x => x.trim())
  try {
    const prices = await getInfo(title, author)
    spinner.stop(true)
    console.log(`min: ${chalk.red(Math.min(...prices))} avg: ${chalk.yellow(avg(prices))} max: ${chalk.green(Math.max(...prices))}`)
  } catch (error) {
    spinner.stop(true)
    console.log(chalk.red('Wystąpił błąd, możliwe powody: źle wprowadzone dane, brak połączenia internetowego, brak książki w bazie danych'))
  }
})

console.log('Sprawdzanie cen książek')
console.log(chalk.gray('tytuł; nazwisko imie autora'))