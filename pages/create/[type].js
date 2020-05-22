import ContentForm from '@components/content/write-content/content-form/content-form'
import Layout from '@components/layout/normal/layout'
import { usePermission, useContentType } from '@lib/client/hooks'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

const CreateContent = () => {
  const router = useRouter()
  const { type } = router.query

  const { available } = usePermission(
    type ? [`content.${type}.create`, `content.${type}.admin`] : null,
    '/'
  )

  const { contentType } = useContentType(type)

  const [content, setContent] = useState(null)

  const onSave = (newItem) => {
    setContent(newItem)
    // router.push(`/edit/${newItem.type}/${newItem.slug}`)
  }

  useEffect(() => {
    if (contentType && !content) {
      const defaultState = {
        draft: false,
      }

      contentType.fields.forEach((field) => {
        // Default field value
        const fieldValue = field.value || field.defaultValue
        // Content value
        defaultState[field.name] = fieldValue
      })

      setContent(defaultState)
    }
  }, [contentType])

  return (
    <>
      <Layout title="New content">
        <div className="create-page">
          <h1>Create new {contentType ? contentType.title : 'content'}</h1>

          {available && (
            <ContentForm content={content} type={contentType} onSave={onSave} />
          )}
        </div>
      </Layout>
      <style jsx>{`
        .create-page {
          margin-bottom: var(--edge-gap-double);
        }
        h1 {
          margin-bottom: var(--edge-gap);
        }
      `}</style>
    </>
  )
}

export default CreateContent
