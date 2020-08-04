import { useCallback, useEffect, useState } from 'react'

import API from '@lib/api/api-endpoints'
import GroupForm from '@components/groups/write/group-form/group-form'
import Layout from '@components/layout/normal/layout'
import LoadingPage from '@components/generic/loading/loading-page/loading-page'
import fetch from '@lib/fetcher'
import { getGroupTypeDefinition } from '@lib/config'
import { groupPermission } from '@lib/permissions'
import { GetServerSideProps } from 'next'
import { getSession } from '@lib/api/auth/iron'
import { connect } from '@lib/api/db'
import { findOneContent } from '@lib/api/entities/content/content'

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

  const groupTypeDefinition = getGroupTypeDefinition(type)

  // check if group is not in groups mapping
  if (!groupTypeDefinition || !slug || !type) {
    notFound(res)
    return
  }

  let group = null

  try {
    const searchOptions = {
      slug,
    }

    group = await findOneContent(type, searchOptions)

    if (!group) {
      notFound(res)
      return
    }
  } catch (e) {
    notFound(res)
    return
  }

  await connect()

  const currentUser = await getSession(req)

  // check if current user can update a group
  const canAccess = groupPermission(currentUser, type, 'update', group)

  if (!canAccess) {
    notFound(res)
    return
  }

  return {
    props: {
      groupType: groupTypeDefinition,
      currentUser,
      type,
      slug,
    },
  }
}

const EditGroup = ({ groupType, type, slug }) => {
  const [group, setGroup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(API.groups[type] + '/' + slug)
      .then((data) => {
        setGroup(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(true)
        setLoading(false)
      })
  }, [type, slug])

  const onSave = useCallback(
    (newItem) => {
      setGroup(newItem)
    },
    [setGroup]
  )

  return (
    <>
      <Layout title="Edit group">
        {loading ? (
          <LoadingPage />
        ) : error ? (
          'Something went wrong'
        ) : (
          <div className="edit-page">
            <h1>Editing: {group ? group.title : null}</h1>
            <GroupForm type={groupType} onSave={onSave} group={group} />
          </div>
        )}
      </Layout>

      <style jsx>{`
        .edit-page {
          margin-bottom: var(--edge-gap-double);
        }
        h1 {
          margin-bottom: var(--edge-gap);
        }
      `}</style>
    </>
  )
}

export default EditGroup
