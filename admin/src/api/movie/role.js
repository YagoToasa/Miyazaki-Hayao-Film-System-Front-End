import axios from 'axios'
const base = 'https://106.15.194.220:1222/api'

export const getRoles = param => {
  return axios.get(base + '/Role/get-roles')
}

export const createRole = async data => {
  const res = await axios({
    url: base + '/Role/create-role',
    method: 'post',
    data: data,
    headers: { 'Content-Type': 'application/json' }
  })
  return res.data
}

export const updateRole = async data => {
  const res = await axios({
    url: base + '/Role/update-role',
    method: 'post',
    data: data,
    headers: { 'Content-Type': 'application/json' }
  })
  return res.data
}

export const deleteRole = async data => {
  const res = await axios({
    url: base + '/Role/delete-role?id=' + data,
    method: 'post',
    headers: { 'Content-Type': 'application/json' }
  })
  return res.data
}

export const uploadRoleImage = async data => {
  const res = await axios({
    url: base + '/Image/upload-role-image',
    method: 'post',
    data: data,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data
}

