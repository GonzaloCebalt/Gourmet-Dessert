/**
 * cebalt.test.jsx · Tests de frontend · Tarjeta A · Gonzalo Cebalt
 *
 * FT1 · authHeaders() — Clase 7
 * FT7 · Tarjeta de producto (ProductCard) — Clase 10
 */

import React from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

// ─────────────────────────────────────────────────────────────────────────────
// FT1 · authHeaders()
// ─────────────────────────────────────────────────────────────────────────────
// Importamos la función directamente del módulo de servicios
import { authHeaders } from '../services/api.js'

describe('FT1 · authHeaders()', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('con token en localStorage arma Authorization: Bearer <token>', () => {
    localStorage.setItem('access_token', 'abc123')
    const headers = authHeaders()
    expect(headers).toHaveProperty('Authorization', 'Bearer abc123')
  })

  it('sin token no incluye Authorization (nunca "Bearer null")', () => {
    localStorage.removeItem('access_token')
    const headers = authHeaders()
    // No debe tener la propiedad Authorization
    expect(headers).not.toHaveProperty('Authorization')
    // Doble seguro: si existiera, no debe ser "Bearer null"
    expect(headers.Authorization).not.toBe('Bearer null')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FT7 · Tarjeta de producto (ProductCard)
// ─────────────────────────────────────────────────────────────────────────────
import ProductCard from '../components/ProductCard.jsx'
import { CarritoProvider } from '../context/CarritoContext.jsx'

// Wrapper con todos los proveedores necesarios
function Wrapper({ children }) {
  return (
    <MemoryRouter>
      <CarritoProvider>
        {children}
      </CarritoProvider>
    </MemoryRouter>
  )
}

// Producto base con imagen
const productoConImagen = {
  id: 1,
  nombre: 'Mate Artesanal',
  precio_final: 1500,
  cuotas_cantidad: 3,
  cuotas_valor: 500,
  stock: 10,
  imagen_url: '/static/productos/mate.jpg',
  usuario: null,
}

// Producto sin imagen
const productoSinImagen = {
  id: 2,
  nombre: 'Termo Clásico',
  precio_final: 2500,
  cuotas_cantidad: 5,
  cuotas_valor: 500,
  stock: 5,
  imagen_url: null,
  usuario: null,
}

describe('FT7 · ProductCard', () => {
  // Mock de VITE_API_URL para que urlImagen() funcione
  beforeEach(() => {
    vi.stubEnv('VITE_API_URL', 'http://localhost:8000')
  })
  afterEach(() => {
    vi.unstubAllEnvs()
    localStorage.clear()
  })

  it('con imagen: la img tiene alt con el nombre y loading="lazy"', () => {
    render(
      <Wrapper>
        <ProductCard {...productoConImagen} />
      </Wrapper>
    )
    // Busca la imagen por su texto alternativo (nombre del producto)
    const img = screen.getByRole('img', { name: /mate artesanal/i })
    expect(img).toHaveAttribute('loading', 'lazy')
  })

  it('sin imagen: no hay ninguna img con src roto (null/undefined)', () => {
    render(
      <Wrapper>
        <ProductCard {...productoSinImagen} />
      </Wrapper>
    )
    // No debe haber imágenes con src "null" o "undefined"
    const todasLasImgs = screen.queryAllByRole('img')
    todasLasImgs.forEach((img) => {
      expect(img.getAttribute('src')).not.toMatch(/\bnull\b|\bundefined\b/)
    })
  })
})
