'use client'

import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import 'swagger-ui-react/swagger-ui.css'

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false })

export default function ApiDocs() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow px-6 py-8">
        <h1 className="text-2xl font-semibold mb-3">API Documentation</h1>

        <p className="text-sm text-gray-600 mb-6">
          Interactive API docs powered by Swagger UI. If the docs don&apos;t load, you can open the raw OpenAPI JSON.
        </p>

        <div style={{ height: '75vh' }}>
          <Suspense fallback={<div className="p-4">Loading API docs…</div>}>
            <SwaggerUI url="/openapi.json" />
          </Suspense>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          <Link href="/openapi.json">View raw OpenAPI JSON</Link>
        </div>
      </div>
    </main>
  )
}
