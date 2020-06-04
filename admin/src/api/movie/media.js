import axios from 'axios'

const base = 'https://106.15.194.220:1222/api'

export const getMedia = param => {
  return axios.get(base + '/Media/get-medias')
}

export const createMedia = async data => {
  const res = await axios({
    url: base + '/Media/create-media',
    method: 'post',
    data: data,
    headers: { 'Content-Type': 'application/json' }
  })
  return res.data
}

export const updateMedia = async data => {
  const res = await axios({
    url: base + '/Media/update-media',
    method: 'post',
    data: data,
    headers: { 'Content-Type': 'application/json' }
  })
  return res.data
}

export const deleteMedia = async data => {
  const res = await axios({
    url: base + '/Media/delete-media?id=' + data,
    method: 'post',
    headers: { 'Content-Type': 'application/json' }
  })
  return res.data
}
