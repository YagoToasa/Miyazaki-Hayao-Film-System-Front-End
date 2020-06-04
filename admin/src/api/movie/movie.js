import axios from 'axios'

const base = 'https://106.15.194.220:1222/api'

export const getMovies = params => {
  return axios.get(base + '/Movie/get-movies')
}

export const getSimpleMap = param => {
  return axios.get(base + '/Movie/get-simple-map')
}

export const createMovie = async data => {
  const res = await axios({
    url: base + '/Movie/create-movie',
    method: 'post',
    data: data,
    headers: { 'Content-Type': 'application/json' }
  })
  return res.data
}

export const updateMovie = async data => {
  const res = await axios({
    url: base + '/Movie/update-movie',
    method: 'post',
    data: data,
    headers: { 'Content-Type': 'application/json' }
  })
  return res.data
}

export const deleteMovie = async data => {
  const res = await axios({
    url: base + '/Movie/delete-movie?id=' + data,
    method: 'post',
    headers: { 'Content-Type': 'application/json' }
  })
  return res.data
}

export const uploadCoverImage = async data => {
  const res = await axios({
    url: base + '/Image/upload-cover-image',
    method: 'post',
    data: data,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data
}

export const uploadPosterImage = async data => {
  const res = await axios({
    url: base + '/Image/upload-poster-image',
    method: 'post',
    data: data,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data
}
