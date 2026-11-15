// setup.js — se ejecuta antes de cada test de Vitest
import '@testing-library/jest-dom'
import React from 'react'

globalThis.React = React

// Mock para localStorage en Node 22+ donde globalThis.localStorage puede ser un stub experimental
const storageMock = (() => {
  let store = {}
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => {
      store[key] = String(value)
    },
    removeItem: (key) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
    get length() {
      return Object.keys(store).length
    },
    key: (index) => Object.keys(store)[index] ?? null,
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: storageMock,
  writable: true,
})

Object.defineProperty(globalThis, 'localStorage', {
  value: storageMock,
  writable: true,
})
