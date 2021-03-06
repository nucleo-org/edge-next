import React, { memo, useCallback, useState } from 'react'

import Button from '@components/generic/button/button'
import DropdownMenu from '@components/generic/dropdown-menu/dropdown-menu'

const ActionsCell = ({
  blockRequest,
  id,
  blocked: defaultBlocked,
  deleteRequest,
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [blocked, setBlocked] = useState<boolean>(defaultBlocked)
  const [isDeleted, setIsDeleted] = useState<boolean>(defaultBlocked)

  const onClickBlockUser = useCallback(() => {
    const result = window.confirm('Are you sure you want to block this user?')

    if (result) {
      setLoading(true)
      setError(false)

      blockRequest(id, !blocked)
        .then(() => {
          setError(false)
          setBlocked(!blocked)
        })
        .catch(() => {
          alert('User could not be blocked')
        })
        .finally(() => setLoading(false))
    }
  }, [blockRequest, id, blocked, setBlocked])

  const onClickDelete = useCallback(() => {
    const result = window.confirm('Are you sure you want to delete this user?')

    if (result) {
      setLoading(true)
      setError(false)

      deleteRequest(id)
        .then(() => {
          setError(false)
          setIsDeleted(true)
        })
        .catch(() => {
          setError(true)
        })
        .finally(() => setLoading(false))
    }
  }, [deleteRequest, id, setIsDeleted])

  return (
    <>
      <DropdownMenu align={'right'}>
        <ul>
          <li>
            {!isDeleted && <Button fullWidth href={`/settings/${id}`}>Edit</Button>}
          </li>
          <li>
            {!isDeleted && (
              <Button fullWidth loading={loading} alt={true} onClick={onClickDelete}>
                Delete
              </Button>
            )}
          </li>
          <li>
            {!isDeleted && (
              <Button
                fullWidth
                loading={loading}
                warning={!blocked}
                secondary={blocked}
                onClick={onClickBlockUser}
              >
                {blocked ? 'Unblock' : 'Block'}
              </Button>
            )}
          </li>
          <li>{error && <div className="error">Error deleting item</div>}</li>
          <li>{isDeleted && <div className="success">Item deleted</div>}</li>
        </ul>
      </DropdownMenu>
      <style jsx>{`
        
      `}</style>
    </>
  )
}

export default memo(ActionsCell)
