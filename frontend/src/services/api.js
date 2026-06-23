import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
})

export async function getBooks(params = {}) {
  const { data } = await client.get('/books', { params })
  return data
}

export async function getBook(id) {
  const { data } = await client.get(`/books/${id}`)
  return data
}

export async function createBook(payload) {
  const { data } = await client.post('/books', payload)
  return data
}

export async function updateBook(id, payload) {
  const { data } = await client.put(`/books/${id}`, payload)
  return data
}

export async function deleteBook(id) {
  await client.delete(`/books/${id}`)
}

export async function getCategories() {
  const { data } = await client.get('/books/categories')
  return data
}

export async function getWriters() {
  const { data } = await client.get('/writers')
  return data
}

export async function getReviews(bookId) {
  const { data } = await client.get('/reviews', { params: bookId ? { bookId } : {} })
  return data
}

export async function submitReview(payload) {
  const { data } = await client.post('/reviews', payload)
  return data
}

export async function demoLogin(role) {
  const { data } = await client.post('/auth/demo', null, { params: { role } })
  return data
}

export async function getLibrary() {
  const { data } = await client.get('/library')
  return data
}

export async function addToLibrary(bookId) {
  const { data } = await client.post(`/library/${bookId}`)
  return data
}

export async function getPurchases() {
  const { data } = await client.get('/purchases')
  return data
}

export async function buyBook(bookId) {
  const { data } = await client.post(`/purchases/${bookId}`)
  return data
}

export async function getWriterBooks() {
  const { data } = await client.get('/writer/books')
  return data
}

export async function getWriterDashboard() {
  const { data } = await client.get('/writer/dashboard')
  return data
}

export async function getAdminDashboard() {
  const { data } = await client.get('/admin/dashboard')
  return data
}

export async function getAdminUsers() {
  const { data } = await client.get('/admin/users')
  return data
}

export async function banUser(id) {
  const { data } = await client.patch(`/admin/users/${id}/ban`)
  return data
}

export async function getAdminBooks() {
  const { data } = await client.get('/admin/books')
  return data
}

export async function setBookApproval(id, status) {
  const { data } = await client.patch(`/admin/books/${id}/approval`, null, { params: { status } })
  return data
}

export async function getAdminReviews() {
  const { data } = await client.get('/admin/reviews')
  return data
}

export async function markReviewReviewed(id) {
  const { data } = await client.patch(`/admin/reviews/${id}/reviewed`)
  return data
}

export async function hasPurchased(bookId) {
  const { data } = await client.get(`/purchases/check/${bookId}`);
  return Boolean(data);
}

export async function verifyPayment(bookId) {
  const { data } = await client.post("/payments/verify", {
    bookId,
  });

  return data;
}
