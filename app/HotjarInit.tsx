'use client';

import { hotjar } from 'react-hotjar'
import { useEffect } from 'react'

export default function HotjarInit() {
  useEffect(() => {
    hotjar.initialize(5052807, 6)
  }, [])

  return null;
}