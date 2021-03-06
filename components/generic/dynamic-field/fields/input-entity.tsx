import { useCallback, useEffect, useMemo, useState, memo } from 'react'

import Button from '@components/generic/button/button'
import EntitySearch from '@components/generic/entity-search/entity-search'
import {
  ExtendedColumn,
  Table as ReactTable,
} from '@components/generic/react-table'

function InputEntity(props) {
  const { value, field, onChange: onChangeCallback } = props
  const [values, setVal] = useState(value || [])

  const validate = useCallback(
    (value) => {
      return field.required && value.length === 0 ? false : true
    },
    [field]
  )

  const onChange = useCallback(
    (item) => {
      const newVal = field.multiple ? [item, ...values] : [item]

      onChangeCallback(newVal, validate(newVal))
      setVal(newVal)
    },
    [field, setVal, values, onChangeCallback, validate]
  )

  const removeItem = useCallback(
    (item) => () => {
      const newVal = values.filter((i) => i.id !== item.id)

      setVal(newVal)
      onChangeCallback(newVal, validate(newVal))
    },
    [setVal, values, onChangeCallback, validate]
  )

  useEffect(() => {
    setVal(values)
  }, [value])

  const columns = useMemo<ExtendedColumn<{ [key: string]: any }>[]>(
    () => [
      {
        Header: 'Item',
        Cell: ({ row: { original } }) => original[field.entityName],
      },
      {
        Header: 'Actions',
        Cell: ({ row: { original } }) => (
          <Button restProps={{ type: 'button' }} onClick={removeItem(original)}>
            Remove
          </Button>
        ),
      },
    ],
    []
  )
  const entityNameGetter = useCallback((item) => item[field.entityName], [
    field,
  ])

  return (
    <div className="input-entity" data-testid={props['data-testid']}>
      <EntitySearch
        placeholder={props.field.placeholder}
        entity={props.field.entity}
        entityType={props.field.entityType}
        entityName={entityNameGetter}
        onChange={onChange}
      />

      <div className="results">
        <ReactTable data={values} columns={columns} isEmpty={!values.length} />
      </div>
    </div>
  )
}

export default memo(InputEntity)
