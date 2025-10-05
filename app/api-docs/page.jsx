// app/api-docs/page.jsx
'use client'

import dynamic from 'next/dynamic'
import 'swagger-ui-react/swagger-ui.css'

// load Swagger UI only on client
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false })

export default function ApiDocs() {
  return (
    <div style={{ height: '100vh' }}>
      <SwaggerUI url="/openapi.json" />
    </div>
  )
}
