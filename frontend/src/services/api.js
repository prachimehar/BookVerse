import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
})

function getStoredAuth() {
  try {
    const stored = localStorage.getItem('bookverse-auth')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function setStoredAuth(auth) {
  localStorage.setItem('bookverse-auth', JSON.stringify(auth))
}

client.interceptors.request.use((config) => {
  const auth = getStoredAuth()

  if (auth?.accessToken) {
    config.headers.Authorization = `${auth.tokenType || 'Bearer'} ${auth.accessToken}`
  }

  return config
})

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const auth = getStoredAuth()

const status = error.response?.status
if ((status === 401 || status === 403) && auth?.refreshToken && !originalRequest?._retry) {      
  originalRequest._retry = true
      try {
        const { data } = await axios.post(`${client.defaults.baseURL}/auth/refresh`, {
          refreshToken: auth.refreshToken,
        })
        const nextAuth = {
          ...auth,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          tokenType: data.tokenType || 'Bearer',
          user: data.user,
          roles: data.user?.roles || [],
          isAuthenticated: true,
        }
        setStoredAuth(nextAuth)
        originalRequest.headers.Authorization = `${nextAuth.tokenType} ${nextAuth.accessToken}`
        return client(originalRequest)
      } catch (refreshError) {
        console.error('Token refresh failed', refreshError)
        localStorage.removeItem('bookverse-auth')
      }
    }

    return Promise.reject(error)
  },
)

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

  console.log("Fetching reviews for", bookId)

  const { data } = await client.get(
      '/reviews',
      { params: bookId ? { bookId } : {} }
  )

  console.log(data)

  return data
}

export async function submitReview(payload) {
  const { data } = await client.post('/reviews', payload)
  return data
}

export async function signup(payload) {
  const { data } = await client.post('/auth/signup', payload)
  return data
}

export async function loginWithEmail(payload) {
  const { data } = await client.post('/auth/login', payload)
  return data
}

export async function loginWithGoogle(credential) {
  const { data } = await client.post('/auth/google', { credential })
  return data
}

export async function logoutSession(refreshToken) {
  await client.post('/auth/logout', { refreshToken })
}

export async function forgotPassword(email) {
  const { data } = await client.post('/auth/forgot-password', { email })
  return data
}

export async function resetPassword(payload) {
  await client.post('/auth/reset-password', payload)
}

export async function becomeWriter() {
  const { data } = await client.post('/auth/become-writer')
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

export async function createWriting(payload) {
  const { data } = await client.post('/writing', payload)
  return data
}

export async function getMyWritings() {
  const { data } = await client.get('/writing/my')
  return data
}

export async function getPublicWritings(params = {}) {
  const { data } = await client.get('/writing/public', { params })
  return data
}

export async function getWriting(id) {
  const { data } = await client.get(`/writing/${id}`)
  return data
}

export async function updateWriting(id, payload) {
  const { data } = await client.put(`/writing/${id}`, payload)
  return data
}

export async function deleteWriting(id) {
  await client.delete(`/writing/${id}`)
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

export async function getPendingWritings() {
  const { data } = await client.get('/admin/writing/pending')
  return data
}

export async function setWritingApproval(id, status) {
  const { data } = await client.patch(`/admin/writing/${id}/approval`, null, { params: { status } })
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

export async function rejectAdminReview(id) {
  await client.delete(`/admin/reviews/${id}`)
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

export async function getMarketplaceListings() {
  const { data } = await client.get('/marketplace')
  return data
}

export async function getMarketplaceListing(id) {
  const { data } = await client.get(`/marketplace/${id}`)
  return data
}

export async function createMarketplaceListing(payload) {
  const { data } = await client.post('/marketplace', payload)
  return data
}

export async function getMyMarketplaceListings(sellerId) {
  const { data } = await client.get('/marketplace/mine', { params: sellerId ? { sellerId } : {} })
  return data
}

export async function markMarketplaceListingSold(id) {
  const { data } = await client.patch(`/marketplace/${id}/sold`)
  return data
}

export async function deleteMarketplaceListing(id) {
  await client.delete(`/marketplace/${id}`)
}

export async function getAdminMarketplaceListings() {
  const { data } = await client.get('/admin/marketplace')
  return data
}

export async function approveMarketplaceListing(id) {
  const { data } = await client.patch(`/admin/marketplace/${id}/approve`)
  return data
}

export async function rejectMarketplaceListing(id) {
  await client.delete(`/admin/marketplace/${id}`)
}
