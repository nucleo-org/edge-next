import { Fragment, memo, useCallback, useEffect, useRef, useState } from 'react'
import Sorting, { SortingValue } from '@components/generic/sorting'
import { useInfinityList, useOnScreen } from '@lib/client/hooks'

import API from '@lib/api/api-endpoints'
import Button from '@components/generic/button/button'
import ContentDetailView from '../content-detail-view/content-detail-view'
import { ContentTypeDefinition } from '@lib/types/contentTypeDefinition'
import EmptyList from '@components/generic/empty-list'
import { GroupEntityType } from '@lib/types'
import LoadingItems from '@components/generic/loading/loading-items'

const sortingOptions = [
  { label: 'Most recent', value: 'createdAt' },
  { label: 'Title', value: 'title' },
]

interface Props {
  infiniteScroll?: boolean
  addComments?: boolean
  query?: string
  defaultSortOptions?: SortingValue
  initialData?: object | object[]
  type: ContentTypeDefinition
  withSorting?: boolean
}

function ContentListView({
  query = '',
  addComments,
  type,
  infiniteScroll = false,
  initialData = null,
  withSorting = true,
  defaultSortOptions = { sortBy: 'createdAt', sortOrder: 'DESC' },
}: Props) {
  let initData = null
  const [sorting, setSorting] = useState<SortingValue>(defaultSortOptions)
  const { sortBy, sortOrder } = sorting

  if (initialData) {
    if (Array.isArray(initialData)) {
      initData = initialData
    } else {
      initData = [initialData]
    }
  }

  const {
    data,
    loadNewItems,
    isReachingEnd,
    isEmpty,
    isLoadingMore,
  } = useInfinityList<GroupEntityType>({
    url: `${API.content[type.slug]}`,
    limit: 10,
    query,
    sortBy,
    sortOrder,
    config: {
      initialData: initData,
      revalidateOnFocus: false,
    },
  })

  const $loadMoreButton = useRef(null)
  const isOnScreen = useOnScreen($loadMoreButton, '200px')

  useEffect(() => {
    if (isOnScreen && infiniteScroll) {
      loadNewItems()
    }
  }, [isOnScreen, infiniteScroll])

  return (
    <>
      <div className="contentListView">
        {withSorting && !isEmpty && (
          <Sorting
            value={sorting}
            onChange={setSorting}
            options={sortingOptions}
          />
        )}
        {data.map((item) => (
          <Fragment key={`${item.id}${item.createdAt}`}>
            <ContentDetailView
              content={item}
              type={type}
              summary={true}
              showActions={false}
              showComments={false}
              addComments={addComments}
            />
          </Fragment>
        ))}
        {isLoadingMore && <LoadingItems />}
        {isEmpty && <EmptyList />}
        <div className="load-more">
          {isReachingEnd ? null : (
            <Button
              reference={$loadMoreButton}
              loading={isLoadingMore}
              big={true}
              fullWidth={true}
              onClick={loadNewItems}
            >
              Load More
            </Button>
          )}
        </div>
      </div>
      <style jsx>{`
        .load-more {
          display: flex;
          justify-content: center;
        }
      `}</style>
    </>
  )
}

export default memo(ContentListView)
