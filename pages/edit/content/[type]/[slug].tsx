import { useCallback, useState } from 'react'

import ContentForm from '@components/content/write-content/content-form/content-form'
import { GetServerSideProps } from 'next'
import Layout from '@components/layout/normal/layout'
import { connect } from '@lib/api/db'
import { contentPermission } from '@lib/permissions'
import { findOneContent } from '@lib/api/entities/content'
import { getContentTypeDefinition } from '@lib/config'
import { getSession } from '@lib/api/auth/iron'

function notFound(res) {
  res.writeHead(302, { Location: '/404' })
  res.end()
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const { type, slug } = query

  const contentTypeDefinition = getContentTypeDefinition(type)

  // check if content is not in groups mapping
  if (!contentTypeDefinition || !slug || !type) {
    notFound(res)
    return
  }

  await connect()

  let content = null

  try {
    const searchOptions = {
      slug,
    }

    content = await findOneContent(type, searchOptions)

    if (!content) {
      notFound(res)
      return
    }
  } catch (e) {
    notFound(res)
    return
  }

  const currentUser = await getSession(req)

  // check if current user can update a content
  const canAccess = contentPermission(
    currentUser,
    contentTypeDefinition.slug,
    'update',
    content
  )

  if (!canAccess) {
    notFound(res)
    return
  }

  return {
    props: {
      contentType: contentTypeDefinition,
      contentObject: content,
    },
  }
}

const EditContent = ({ contentType, contentObject }) => {
  const [content, setContent] = useState(contentObject)

  const onSave = useCallback(
    (newItem) => {
      setContent(newItem)
    },
    [setContent]
  )

  return (
    <>
      <Layout title="Edit content">
        <div className="edit-page">
          <h1>Editing: {content ? content.title : null}</h1>
          <ContentForm type={contentType} onSave={onSave} content={content} />
        </div>
      </Layout>

      <style jsx>{`
        .edit-page {
          margin-bottom: var(--edge-gap-double);
        }
        h1 {
          font-size: 23px;
          font-weight: 500;
          margin-bottom: var(--edge-gap);
        }

        .edit-page .description {
          font-size: 12px;
        }
      `}</style>
    </>
  )
}

export default EditContent