import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const API_URL = 'http://localhost:5000'

function Profile() {
  const { user, setUser } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    nacionalidad: '',
    password: ''
  })
  const [stats, setStats] = useState({
    puntos: 0,
    partidosJugados: 0,
    partidosGanados: 0,
    partidosPerdidos: 0,
    torneosInscritos: 0
  })
  const [puntosHistory, setPuntosHistory] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [adminUsers, setAdminUsers] = useState([])
  const [adminFilter, setAdminFilter] = useState('')
  const [adminQuery, setAdminQuery] = useState('')
  const [adminLoading, setAdminLoading] = useState(false)
  const [adminError, setAdminError] = useState('')

  console.log('Profile component rendered, user:', user, 'loading:', loading)

  // Verificar autenticación al cargar
  useEffect(() => {
    console.log('Profile useEffect - user check:', user)
    if (!user) {
      setLoading(false)
      setError('Debes iniciar sesión para ver tu perfil.')
      return
    }
  }, [user])

  useEffect(() => {
    if (!user) return

    setFormData({
      nombre: user.nombre || '',
      apellido: user.apellido || '',
      email: user.email || '',
      nacionalidad: user.nacionalidad || '',
      password: ''
    })
    setStats({
      puntos: user.puntos || 0,
      partidosJugados: user.stats?.partidosJugados || 0,
      partidosGanados: user.stats?.partidosGanados || 0,
      partidosPerdidos: user.stats?.partidosPerdidos || 0,
      torneosInscritos: user.stats?.torneosInscritos || 0
    })
  }, [user])

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      setLoading(true)
      setError('')

      try {
        // Obtener perfil actualizado
        const profileRes = await fetch(`${API_URL}/api/auth/profile`, {
          method: 'GET',
          credentials: 'include'
        })
        const profileBody = await profileRes.json()

        if (profileBody.ok) {
          const userData = profileBody.datos
          setFormData({
            nombre: userData.nombre || '',
            apellido: userData.apellido || '',
            email: userData.email || '',
            nacionalidad: userData.nacionalidad || '',
            password: ''
          })
          setStats({
            puntos: userData.puntos || 0,
            partidosJugados: userData.stats?.partidosJugados || 0,
            partidosGanados: userData.stats?.partidosGanados || 0,
            partidosPerdidos: userData.stats?.partidosPerdidos || 0,
            torneosInscritos: userData.stats?.torneosInscritos || 0
          })
        }

        // Obtener historial de puntos
        const historyRes = await fetch(`${API_URL}/api/rankings/puntos/history`, {
          method: 'GET',
          credentials: 'include'
        })
        const historyBody = await historyRes.json()

        if (historyBody.ok) {
          setPuntosHistory(historyBody.datos)
        }

      } catch (err) {
        setError('Error al cargar los datos del perfil.')
        console.error('Error fetching profile data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  useEffect(() => {
    if (!user || user.rol !== 'administrador') return

    const fetchAdminUsers = async () => {
      setAdminLoading(true)
      setAdminError('')

      try {
        const query = adminQuery ? `?torneo=${encodeURIComponent(adminQuery)}` : ''
        const response = await fetch(`${API_URL}/api/auth/users${query}`, {
          method: 'GET',
          credentials: 'include'
        })
        const body = await response.json()

        if (body.ok) {
          setAdminUsers(body.datos || [])
        } else {
          setAdminError(body.mensaje || 'Error al cargar los usuarios.')
        }
      } catch (err) {
        setAdminError('Error al cargar los usuarios.')
        console.error('Error fetching admin users:', err)
      } finally {
        setAdminLoading(false)
      }
    }

    fetchAdminUsers()
  }, [user, adminQuery])

  const handleAdminSearch = (event) => {
    event.preventDefault()
    if (!user || user.rol !== 'administrador') return
    setAdminQuery(adminFilter.trim())
  }

  const clearAdminFilter = () => {
    setAdminFilter('')
    setAdminQuery('')
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('¿Seguro que quieres eliminar este usuario? Esta acción es irreversible.')) {
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      const body = await response.json()
      if (!body.ok) {
        setAdminError(body.mensaje || 'Error al eliminar el usuario.')
        return
      }
      setAdminUsers((prev) => prev.filter((u) => u.id !== userId))
    } catch (err) {
      setAdminError('No se pudo conectar con el servidor.')
      console.error('Error deleting user:', err)
    }
  }

  const visibleAdminUsers = adminQuery
    ? adminUsers.filter((userRecord) => (userRecord.matches || []).length > 0)
    : adminUsers

  const PuntosChart = ({ data }) => {
    if (!data || data.length === 0) return null

    const width = 300
    const height = 150
    const padding = 20
    const pointsCount = data.length > 1 ? data.length - 1 : 1

    const normalizedData = data.map((d) => ({
      ...d,
      puntos_totales: Number(d.puntos_totales ?? d.puntos ?? 0)
    }))

    const maxPuntos = Math.max(...normalizedData.map(d => d.puntos_totales))
    const minPuntos = Math.min(...normalizedData.map(d => d.puntos_totales))
    const range = maxPuntos - minPuntos || 1

    const points = normalizedData.map((d, i) => {
      const x = padding + (i * (width - 2 * padding)) / pointsCount
      const y = height - padding - ((d.puntos_totales - minPuntos) * (height - 2 * padding)) / range
      return `${x},${y}`
    }).join(' ')

    return (
      <div className="bg-secondary rounded-3 p-3">
        <h6 className="text-white mb-3">Evolución de Puntos</h6>
        <svg width={width} height={height} className="w-100">
          {/* Líneas de fondo */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = height - padding - (ratio * (height - 2 * padding))
            return (
              <line
                key={i}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#495057"
                strokeWidth="1"
                opacity="0.3"
              />
            )
          })}

          {/* Línea principal */}
          <polyline
            points={points}
            fill="none"
            stroke="#007bff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Puntos */}
          {data.map((d, i) => {
            const x = padding + (i * (width - 2 * padding)) / (data.length - 1)
            const y = height - padding - ((d.puntos_totales - minPuntos) * (height - 2 * padding)) / (maxPuntos - minPuntos || 1)
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="4"
                fill="#007bff"
                stroke="#fff"
                strokeWidth="2"
              />
            )
          })}
        </svg>
        <div className="d-flex justify-content-between mt-2">
          <small className="text-white">
            {data.length > 0 ? `${data[0].mes}/${data[0].ano}` : ''}
          </small>
          <small className="text-white">
            {data.length > 0 ? `${data[data.length - 1].mes}/${data[data.length - 1].ano}` : ''}
          </small>
        </div>
      </div>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!formData.nombre || !formData.apellido || !formData.email) {
      setError('Nombre, apellido y email son obligatorios.')
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      const body = await response.json()
      if (!body.ok) {
        setError(body.mensaje || 'Error al actualizar el perfil')
        return
      }

      setUser(body.datos)
      setFormData((prev) => ({ ...prev, password: '' }))
      setStats({
        puntos: body.datos.puntos || 0,
        partidosJugados: body.datos.stats?.partidosJugados || stats.partidosJugados,
        partidosGanados: body.datos.stats?.partidosGanados || stats.partidosGanados,
        partidosPerdidos: body.datos.stats?.partidosPerdidos || stats.partidosPerdidos,
        torneosInscritos: body.datos.stats?.torneosInscritos || stats.torneosInscritos
      })
      setMessage('Perfil actualizado correctamente.')
    } catch (err) {
      setError('No se pudo conectar con el backend.')
    } finally {
      setSaving(false)
    }
  }

  console.log('Profile render - user:', user, 'loading:', loading, 'error:', error)

  if (loading) {
    console.log('Showing loading spinner')
    return (
      <div className="container py-5">
        <div className="text-center text-white">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p>Cargando perfil...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    console.log('Showing access denied')
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card text-white bg-dark border-secondary shadow">
              <div className="card-body text-center">
                <h3 className="card-title mb-3">Acceso Denegado</h3>
                <p className="mb-3">Debes iniciar sesión para ver tu perfil.</p>
                <a href="/auth" className="btn btn-primary">Iniciar Sesión</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  console.log('Showing profile content')

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="text-white mb-1">{user?.rol === 'administrador' ? 'Panel de Administración' : 'Mi Perfil'}</h2>
              <p className="text-white mb-0">Revisa tus estadísticas y actualiza tu información personal sin perder el estilo oscuro.</p>
            </div>
            <span className={`badge ${user?.rol === 'administrador' ? 'bg-danger' : 'bg-warning'} text-dark py-2 px-3`}>
              {user?.rol === 'administrador' ? 'Administrador' : 'Jugador'}
            </span>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}

          <div className="row g-4">
            <div className="col-lg-5">
              <div className="card bg-dark border-secondary shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-4">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                      <span className="fs-4">{user?.nombre?.charAt(0) || 'J'}</span>
                    </div>
                    <div className="ms-3">
                      <h5 className="mb-1">{user?.nombre} {user?.apellido}</h5>
                      <p className="text-white mb-0">{user?.email}</p>
                    </div>
                  </div>

                  <div className="row gy-3">
                    <div className="col-12 mb-3">
                      <PuntosChart data={puntosHistory} />
                    </div>

                    <div className="col-6">
                      <div className="bg-secondary rounded-3 p-3 text-center">
                        <div className="text-white small">Torneos</div>
                        <div className="fs-4 fw-bold">{stats.torneosInscritos}</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="bg-secondary rounded-3 p-3 text-center">
                        <div className="text-white small">Jugados</div>
                        <div className="fs-4 fw-bold">{stats.partidosJugados}</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="bg-secondary rounded-3 p-3 text-center">
                        <div className="text-white small">Ganados</div>
                        <div className="fs-4 fw-bold">{stats.partidosGanados}</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="bg-secondary rounded-3 p-3 text-center">
                        <div className="text-white small">Perdidos</div>
                        <div className="fs-4 fw-bold">{stats.partidosPerdidos}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="card bg-dark border-secondary shadow-sm h-100">
                <div className="card-body">
                  <h5 className="mb-3">Editar información</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label text-white">Nombre</label>
                        <input
                          type="text"
                          name="nombre"
                          className="form-control bg-dark text-white border-secondary"
                          value={formData.nombre}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-white">Apellido</label>
                        <input
                          type="text"
                          name="apellido"
                          className="form-control bg-dark text-white border-secondary"
                          value={formData.apellido}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-white">Email</label>
                        <input
                          type="email"
                          name="email"
                          className="form-control bg-dark text-white border-secondary"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-white">Nacionalidad</label>
                        <input
                          type="text"
                          name="nacionalidad"
                          className="form-control bg-dark text-white border-secondary"
                          value={formData.nacionalidad}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label text-white">Contraseña nueva</label>
                        <input
                          type="password"
                          name="password"
                          className="form-control bg-dark text-white border-secondary"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Dejar en blanco para mantener la contraseña actual"
                        />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary mt-4 w-100" disabled={saving}>
                      {saving ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {user?.rol === 'administrador' && (
            <div className="row mt-4">
              <div className="col-12">
                <div className="card bg-dark border-secondary shadow-sm">
                  <div className="card-body">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
                      <div>
                        <h5 className="text-white mb-1">Usuarios y partidos</h5>
                        <p className="text-white-50 mb-0">Filtra por nombre de torneo para ver los partidos asociados a cada usuario.</p>
                      </div>
                      <form className="d-flex gap-2 flex-column flex-sm-row w-100 w-sm-auto" onSubmit={handleAdminSearch}>
                        <input
                          type="text"
                          className="form-control form-control-sm bg-secondary text-white border-secondary"
                          placeholder="Nombre del torneo"
                          value={adminFilter}
                          onChange={(e) => setAdminFilter(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary btn-sm">Buscar</button>
                        <button type="button" className="btn btn-outline-light btn-sm" onClick={clearAdminFilter}>Limpiar</button>
                      </form>
                    </div>

                    {adminError && <div className="alert alert-danger">{adminError}</div>}
                    {adminLoading ? (
                      <div className="text-center text-white py-4">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Cargando...</span>
                        </div>
                      </div>
                    ) : visibleAdminUsers.length === 0 ? (
                      <p className="text-white mb-0">No se encontraron usuarios con partidos para ese torneo.</p>
                    ) : (
                      <div className="accordion" id="adminUsersAccordion">
                        {visibleAdminUsers.map((adminUser, index) => {
                          const matches = [
                            ...(adminUser.matches || [])
                          ].sort((a, b) => {
                            const aDate = new Date(a.fecha_partido || a.fecha || a.fechaPartido || 0).getTime() || 0
                            const bDate = new Date(b.fecha_partido || b.fecha || b.fechaPartido || 0).getTime() || 0
                            return bDate - aDate
                          })

                          return (
                            <div key={adminUser.id} className="accordion-item bg-dark border-secondary mb-3">
                              <h2 className="accordion-header" id={`heading${adminUser.id}`}>
                                <button
                                  className="accordion-button collapsed bg-dark text-white"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target={`#collapse${adminUser.id}`}
                                  aria-expanded="false"
                                  aria-controls={`collapse${adminUser.id}`}
                                >
                                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center w-100 gap-3">
                                  <div>
                                    <span className="fw-bold">{adminUser.nombre} {adminUser.apellido}</span>
                                    <small className="text-white-50">{adminUser.email} · Puntos: {adminUser.puntos} · Partidos: {matches.length}</small>
                                  </div>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-danger"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDeleteUser(adminUser.id)
                                    }}
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              </button>
                              </h2>
                              <div
                                id={`collapse${adminUser.id}`}
                                className="accordion-collapse collapse"
                                aria-labelledby={`heading${adminUser.id}`}
                                data-bs-parent="#adminUsersAccordion"
                              >
                                <div className="accordion-body bg-secondary bg-opacity-10">
                                  {matches.length === 0 ? (
                                    <p className="text-white-50 mb-0">No hay partidos para este usuario en el torneo seleccionado.</p>
                                  ) : (
                                    <div className="row gy-3">
                                      {matches.map((match) => {
                                        const opponent = match.jugador1_id === adminUser.id ? match.jugador2 : match.jugador1
                                        const winnerName = match.ganador ? `${match.ganador.nombre} ${match.ganador.apellido}` : 'Pendiente'
                                        const torneoNombre = match.torneo?.nombre || `Torneo ${match.torneo_id || ''}`
                                        const fechaRaw = match.fecha_partido ?? match.fechaPartido ?? match.fecha ?? match.torneo?.fecha_fin ?? ''
                                        const fechaDate = fechaRaw ? new Date(fechaRaw) : null
                                        const fechaTexto = fechaDate && !isNaN(fechaDate.getTime())
                                          ? fechaDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
                                          : 'Sin fecha'
                                        const resultado = match.resultado_jugador1 !== null && match.resultado_jugador2 !== null
                                          ? `${match.resultado_jugador1} - ${match.resultado_jugador2}`
                                          : 'Pendiente'

                                        return (
                                          <div key={match.id} className="col-12">
                                            <div className="card bg-dark border-secondary">
                                              <div className="card-body">
                                                <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                                                  <div>
                                                    <h6 className="text-white mb-1">{torneoNombre}</h6>
                                                    <small className="text-white-50">Ronda {match.ronda} · {fechaTexto}</small>
                                                  </div>
                                                  <span className="badge bg-primary">{match.estado || 'Pendiente'}</span>
                                                </div>
                                                <div className="row mt-3">
                                                  <div className="col-md-4 mb-2 mb-md-0">
                                                    <div className="bg-secondary rounded-3 p-2 text-white">
                                                      <small>Oponente</small>
                                                      <div className="fw-bold">{opponent?.nombre} {opponent?.apellido}</div>
                                                    </div>
                                                  </div>
                                                  <div className="col-md-4 mb-2 mb-md-0">
                                                    <div className="bg-secondary rounded-3 p-2 text-white">
                                                      <small>Resultado</small>
                                                      <div className="fw-bold">{resultado}</div>
                                                    </div>
                                                  </div>
                                                  <div className="col-md-4">
                                                    <div className="bg-secondary rounded-3 p-2 text-white">
                                                      <small>Ganador</small>
                                                      <div className="fw-bold">{winnerName}</div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )
                                      })}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
