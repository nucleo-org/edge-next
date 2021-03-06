import React, { memo } from 'react'

import Avatar from '@components/user/avatar/avatar'
import { UserType } from '@lib/types'

type Props = {
  title?: string
  users?: UserType[]
  maxItems?: number
  width: string
}

function StackedAvatars({
  title = '',
  width,
  users = [],
  maxItems = 3,
}: Props) {
  const usersVisible = users.slice(0, maxItems)
  const extraUsers = users.length > maxItems ? users.length - maxItems : 0

  return (
    <>
      {!!usersVisible.length && (
        <>
          <div className="users-title">{title}</div>
          <div className="users-list">
            {usersVisible.map((user, index) => {
              return (
                <div className="user-item" key={`${user.id}-${index}`}>
                  <Avatar radius="50%" width={width} user={user} />
                </div>
              )
            })}
            {!!extraUsers && (
              <div className="user-item">
                <div className="extra-users">+{extraUsers}</div>
              </div>
            )}
          </div>
        </>
      )}
      <style jsx>{`
        .users-list {
          display: flex;
        }

        .users-title {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          display: none;
        }

        .user-item {
          border-radius: 100%;
          overflow: hidden;
          background: white;
          padding: 2px;
        }

        .user-item:not(:first-child) {
          margin-left: -18px;
          -webkit-mask: radial-gradient(
            circle 24px at -5px -50%,
            transparent 99%,
            #fff 100%
          );
          mask: radial-gradient(
            circle 24px at -5px -50%,
            transparent 99%,
            #fff 100%
          );
        }

        .extra-users {
          width: ${width};
          height: ${width};
          background: var(--edge-success);
          color: var(--edge-background);
          border-radius: 100%;
          font-size: 12px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        

       
      `}</style>
    </>
  )
}

export default memo(StackedAvatars)
