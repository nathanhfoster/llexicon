import React, { useMemo, memo } from 'react'
import PropTypes from 'prop-types'
import { Card, CardHeader, CardText, CardBody, CardTitle } from 'reactstrap'
import { isType } from '../../../utils'
import './styles.css'

export const BasicCard = ({
  selected,
  tag,
  href,
  header,
  title,
  children,
  text,
  faIcon,
  button,
  cardClassName,
  cardHeaderClassName,
  cardBodyClassName,
  cardTitleClassName,
  cardTextClassName,
  onClick,
}) => {
  const handleOnClickCallback = e => onClick && onClick(e)
  const cardHref = !onClick ? href : null
  const cardHoverStyles = useMemo(() => {
    let hoverStyles = ''

    if (onClick || cardHref) {
      hoverStyles = `BasicCardHover`
    }

    if (selected) {
      hoverStyles = `${hoverStyles} BasicCardSelected`
    }

    return hoverStyles
  }, [selected, onClick, cardHref])

  const titleIsObject = typeof title === isType.OBJECT
  const cardTitle = titleIsObject ? title.name : title

  return (
    <Card
      className={`BasicCard ${cardClassName} ${cardHoverStyles}`}
      onClick={handleOnClickCallback}
      title={cardTitle}
      tag={tag}
      href={cardHref}
    >
      <CardHeader tag='div' className={`BasicCardContainer ${cardHeaderClassName}`}>
        {typeof faIcon === 'string' ? <i className={`AboutFeatureIcon ${faIcon}`} /> : header}
      </CardHeader>
      <CardBody tag='div' className={`BasicCardBodyContainer ${cardBodyClassName}`}>
        <CardTitle className={`BasicCardTitle ${cardTitleClassName}`}>
          {titleIsObject ? title.render : title}
        </CardTitle>
        {children}
        {text && (
          <CardText tag='div' className={`BasicCardText ${cardTextClassName}`}>
            {text}
          </CardText>
        )}
        {button && <div className='Center'>{button}</div>}
      </CardBody>
    </Card>
  )
}

BasicCard.propTypes = {
  children: PropTypes.any,
  selected: PropTypes.bool.isRequired,
  tag: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  href: PropTypes.string,
  header: PropTypes.node,
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      name: PropTypes.string,
      render: PropTypes.node.isRequired,
    }),
  ]),
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  faIcon: PropTypes.string,
  button: PropTypes.node,
  cardClassName: PropTypes.string,
  cardHeaderClassName: PropTypes.string,
  onClick: PropTypes.func,
}

BasicCard.defaultProps = {
  selected: false,
  tag: 'div',
  cardClassName: '',
  cardHeaderClassName: '',
  cardBodyClassName: '',
  cardTitleClassName: '',
  cardTextClassName: '',
}

export default memo(BasicCard)
