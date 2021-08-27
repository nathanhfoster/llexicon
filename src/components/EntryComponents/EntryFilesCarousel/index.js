import React, { useContext, useMemo, useCallback, memo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { allEntriesSelector, allItemsAreEqual } from 'redux/Entries/utils'
import { BasicImageCarousel } from '../..'
import { Container, Row, Col, Button } from 'reactstrap'
import { EntryFilesProps } from 'redux/Entries/propTypes'
import { removeAttributeDuplicates } from 'utils'
import { DeleteEntryFile } from 'redux/Entries/actions'
import { EditorConsumer } from '../../Editor'
import { ConfirmAction } from 'components'
import './styles.css'

export const EntryFilesCarousel = ({ className, files, overflowX, overflowY, whiteSpace }) => {
  const { entries } = useSelector(allEntriesSelector, allItemsAreEqual)
  const dispatch = useDispatch()
  const { editorRef, editorSelection } = useContext(EditorConsumer)

  const AllEntryFiles = useMemo(
    () =>
      entries
        .map(item => item.EntryFiles)
        .flat(1)
        .sort((a, b) => new Date(b?.date_updated) - new Date(a?.date_updated)),
    [entries],
  )

  const imageFiles = useMemo(() => {
    const arrayOfImages = []
    if (files) {
      for (const file of files) {
        const {
          date_created,
          date_modified,
          date_updated,
          entry_id,
          file_type,
          id,
          name,
          size,
          url,
        } = file

        if (file_type.includes('image')) {
          arrayOfImages.push(file)
        }
      }
      return removeAttributeDuplicates(arrayOfImages.concat(AllEntryFiles), 'url')
    }
  }, [AllEntryFiles, files])

  const handleImageClick = useCallback(
    ({ images, photoIndex, isOpen }) => {
      const { url, file_type } = images[photoIndex]
      const [type] = file_type.split('/')

      if (!editorRef.current) return
      let cursorIndex = 0

      if (editorSelection) {
        const { index, length } = editorSelection
        cursorIndex = index
      }

      editorRef.current.getEditor().insertEmbed(cursorIndex, type, url)
    },
    [editorRef, editorSelection],
  )

  const handleImageDelete = useCallback(({ images, photoIndex, isOpen }) => {
    const { id, entry_id } = images[photoIndex]
    dispatch(DeleteEntryFile(id, entry_id))
  }, [])

  const toolbarButtons = useMemo(
    () => [
      <Button color='accent' onClick={handleImageClick}>
        Insert Image
      </Button>,
      <ConfirmAction
        message='Are you sure you want to delete this Entry File?'
        onConfirm={handleImageDelete}
        button={
          <Button color='danger'>
            <i className='fas fa-trash-alt mr-1' />
            Delete Image
          </Button>
        }
      />,
    ],
    [handleImageClick, handleImageDelete],
  )

  return (
    <Container className={className}>
      <Row>
        <Col
          xs={12}
          className='EntryFilesCarouselImageContainer p-0'
          style={{ overflowX, overflowY, whiteSpace }}
        >
          <BasicImageCarousel images={imageFiles} toolbarButtons={toolbarButtons} />
        </Col>
      </Row>
    </Container>
  )
}

EntryFilesCarousel.propTypes = {
  files: EntryFilesProps.isRequired,
}

EntryFilesCarousel.defaultProps = {
  className: 'EntryFilesCarousel',
  overflowX: 'auto',
  overflowY: 'hidden',
  whiteSpace: 'nowrap',
}

export default memo(EntryFilesCarousel)
