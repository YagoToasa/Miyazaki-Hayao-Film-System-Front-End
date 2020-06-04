import axios from 'axios'
const base = 'https://106.15.194.220:1222/api'

export const getRemark = param => {
  return axios.get(base + '/Remark/get-remarks')
}

export const createRemark = async data => {
  const res = await axios({
    url: base + '/Remark/create-remark',
    method: 'post',
    data: data,
    headers: { 'Content-Type': 'application/json' }
  })
  return res.data
}

export const updateRemark = async data => {
  const res = await axios({
    url: base + '/Remark/update-remark',
    method: 'post',
    data: data,
    headers: { 'Content-Type': 'application/json' }
  })
  return res.data
}

export const deleteRemark = async data => {
  const res = await axios({
    url: base + '/Remark/delete-remark?id=' + data,
    method: 'post',
    headers: { 'Content-Type': 'application/json' }
  })
  return res.data
}
