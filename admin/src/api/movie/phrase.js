import axios from 'axios'

const base = 'https://106.15.194.220:1222/api'

export const getPhrases = param => {
  return axios.get(base + '/Phrase/get-phrases')
}

export const createPhrase = async data => {
  const res = await axios({
    url: base + '/Phrase/create-phrase',
    method: 'post',
    data: data,
    headers: { 'Content-Type': 'application/json' }
  })
  return res.data
}

export const updatePhrase = async data => {
  const res = await axios({
    url: base + '/Phrase/update-phrase',
    method: 'post',
    data: data,
    headers: { 'Content-Type': 'application/json' }
  })
  return res.data
}

export const deletePhrase = async data => {
  const res = await axios({
    url: base + '/Phrase/delete-phrase?id=' + data,
    method: 'post',
    headers: { 'Content-Type': 'application/json' }
  })
  return res.data
}
