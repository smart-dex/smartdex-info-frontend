import React, { useState, useEffect } from 'react'
import { useMedia } from 'react-use'
import dayjs from 'dayjs'
import LocalLoader from '../LocalLoader'
import utc from 'dayjs/plugin/utc'
import { Box, Flex } from 'rebass'
import styled from 'styled-components'

import { CustomLink } from '../Link'
import { withRouter } from 'react-router-dom'
import { formattedNum } from '../../utils'
import DoubleTokenLogo from '../DoubleLogo'
import { RowFixed } from '../Row'

dayjs.extend(utc)

const PageButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2em;
  margin-bottom: 0.5em;
`

const Arrow = styled.div`
  user-select: none;
  width: 45px;
  height: 16px;
  background: ${({ disableButton }) => (disableButton ? 'rgba(95, 94, 118, 0.05)' : 'rgba(95, 94, 118, 0.1)')};
  border-radius: 5px;
  padding: 12px 15px;
  :hover {
    cursor: ${({ disableButton }) => (disableButton ? 'not-allowed' : 'pointer')};
    background: ${({ disableButton, theme }) => (disableButton ? 'rgba(95, 94, 118, 0.05)' : theme.backgroundPaging)};
    svg {
      fill: ${({ disableButton, theme }) => (disableButton ? theme.textPagingDisable : theme.textHover)};
    }
    span {
      color: ${({ disableButton, theme }) => (disableButton ? theme.textPagingDisable : theme.textHover)};
    }
  }
  svg {
    fill: ${({ theme, disableButton }) => (disableButton ? theme.textPagingDisable : theme.textPaging)};
  }
  span {
    color: ${({ theme, disableButton }) => (disableButton ? theme.textPagingDisable : theme.textPaging)};
  }
`

const ArrowNext = styled(Arrow)`
  svg {
    transform: rotate(180deg);
  }
`

const List = styled(Box)`
  -webkit-overflow-scrolling: touch;
`

const DashGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 10px 4.5fr 1fr 1fr;
  grid-template-areas: 'number name pair value';
  padding: 2px 32px !important;

  > * {
    justify-content: flex-end;
  }

  @media screen and (max-width: 1080px) {
    grid-template-columns: 10px 4.5fr 1fr 1fr;
    grid-template-areas: 'number name pair value';
  }

  @media screen and (max-width: 600px) {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas: 'name pair value';
  }
`

const ListWrapper = styled.div``

const DataText = styled(Flex)`
  align-items: center;
  text-align: center;
  color: ${({ theme }) => theme.textMenu};
  & > * {
    font-size: 13px;
  }

  @media screen and (max-width: 600px) {
    font-size: 13px;
  }
`
const DashGridHeader = styled(DashGrid)`
  background: ${({ theme }) => theme.bgHeaderTable};
  padding: 16px 32px !important;
`

const TableHeader = styled.div`
  font-weight: bold;
  font-size: 14px;
  color: ${({ theme }) => theme.textMenu};
`

const RowTable = styled.div`
  :nth-child(even) {
    background: ${({ theme }) => theme.rowTableColor};
  }
`

const TextPaging = styled.span`
  font-weight: 600;
  font-size: 13px;
  line-height: 100%;
  padding-left: 4px;
`
const PagingMiddle = styled.div`
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;
  padding: 0 16px;
  color: ${({ theme }) => theme.textMenu};
`
const TextPagingNext = styled(TextPaging)`
  padding-left: 0px;
  padding-right: 6px;
`
const SelectStyle = styled.select`
  width: 65px;
  height: 39px;
  padding: 10px;
  background: ${({ theme }) => theme.backgroundSelect};
  border: 1px solid transparent;
  border-radius: 5px;
  color: ${({ theme }) => theme.textSelectPaging};
  margin-right: 4px;
  font-weight: 600;
  font-size: 13px;
  -webkit-appearance: none;
  background-image: url(${({ theme }) => theme.selectArrow});
  background-repeat: no-repeat;
  background-position-x: 70%;
  background-position-y: 16px;
  cursor: pointer;
  option {
    background: ${({ theme }) => theme.backgroundOption};
    :hover {
      background-color: yellow !important;
    }
  }
  :focus {
    outline: none;
  }
`

const listNumber = (maxPage) => {
  let listNumberPaging = []
  for (let i = 0; i < maxPage; i++) {
    listNumberPaging.push(i)
  }
  return listNumberPaging
}

function LPList({ lps, disbaleLinks, maxItems = 10 }) {
  const below600 = useMedia('(max-width: 600px)')
  const below800 = useMedia('(max-width: 800px)')

  // pagination
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const ITEMS_PER_PAGE = maxItems
  const listNumberPaging = listNumber(maxPage)

  useEffect(() => {
    setMaxPage(1) // edit this to do modular
    setPage(1)
  }, [lps])

  useEffect(() => {
    if (lps) {
      let extraPages = 1
      if (Object.keys(lps).length % ITEMS_PER_PAGE === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(Object.keys(lps).length / ITEMS_PER_PAGE) + extraPages)
    }
  }, [ITEMS_PER_PAGE, lps])

  const ListItem = ({ lp, index }) => {
    return (
      <DashGrid style={{ height: '48px' }} disbaleLinks={disbaleLinks} focus={true}>
        {!below600 && (
          <DataText area="number" fontWeight="500">
            {index}
          </DataText>
        )}
        <DataText area="name" fontWeight="500" justifyContent="flex-start">
          <CustomLink style={{ marginLeft: below600 ? 0 : '1rem', whiteSpace: 'nowrap' }} to={'/account/' + lp.user.id}>
            {below800 ? lp.user.id.slice(0, 4) + '...' + lp.user.id.slice(38, 42) : lp.user.id}
          </CustomLink>
        </DataText>

        {/* {!below1080 && (
          <DataText area="type" justifyContent="flex-end">
            {lp.type}
          </DataText>
        )} */}

        <DataText justifyContent="flex-start">
          <CustomLink area="pair" to={'/pair/' + lp.pairAddress}>
            <RowFixed style={{ textAlign: 'left' }}>
              {!below600 && <DoubleTokenLogo a0={lp.token0} a1={lp.token1} size={16} margin={true} />}
              {lp.pairName}
            </RowFixed>
          </CustomLink>
        </DataText>
        <DataText area="value">{formattedNum(lp.usd, true)}</DataText>
      </DashGrid>
    )
  }

  const lpList =
    lps &&
    lps.slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE).map((lp, index) => {
      return (
        <RowTable key={index}>
          <ListItem key={index} index={(page - 1) * 10 + index + 1} lp={lp} />
        </RowTable>
      )
    })

  const handleChangeSelect = (e) => {
    setPage(Number(e.target.value))
  }

  return (
    <ListWrapper>
      <DashGridHeader
        center={true}
        disbaleLinks={disbaleLinks}
        style={{ height: 'fit-content', padding: ' 0 0 1rem 0' }}
      >
        {!below600 && (
          <Flex alignItems="center" justifyContent="flex-start">
            <TableHeader area="number">#</TableHeader>
          </Flex>
        )}
        <Flex alignItems="center" justifyContent="flex-start">
          <TableHeader area="name">Account</TableHeader>
        </Flex>
        {/* {!below1080 && (
          <Flex alignItems="center" justifyContent="flexEnd">
            <TableHeader area="type">Type</TableHeader>
          </Flex>
        )} */}
        <Flex alignItems="center" justifyContent="flex-start">
          <TableHeader area="pair">Pair</TableHeader>
        </Flex>
        <Flex alignItems="center" justifyContent="flexEnd">
          <TableHeader area="value">Value</TableHeader>
        </Flex>
      </DashGridHeader>
      <List p={0}>{!lpList ? <LocalLoader /> : lpList}</List>
      <PageButtons>
        <div onClick={() => setPage(page === 1 ? page : page - 1)}>
          <Arrow disableButton={page === 1 ? true : false}>
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0 5C0 5.2652 0.10536 5.5196 0.292892 5.7071L4.29294 9.70714C4.68344 10.0976 5.31664 10.0976 5.70715 9.70714C6.09765 9.31663 6.09765 8.68343 5.70715 8.29292L2.41422 5L5.70715 1.70708C6.09765 1.31655 6.09765 0.68338 5.70715 0.292847C5.31664 -0.0976766 4.68344 -0.0976766 4.29294 0.292847L0.292892 4.29289C0.10536 4.48039 0 4.73479 0 5Z"
              />
            </svg>

            <TextPaging disableButton={page === 1 ? true : false}> Prev</TextPaging>
          </Arrow>
        </div>
        <PagingMiddle>
          <SelectStyle onChange={handleChangeSelect} value={page}>
            {listNumberPaging && listNumberPaging.map((item) => <option>{item + 1}</option>)}
          </SelectStyle>
          {'  of ' + maxPage}
        </PagingMiddle>
        <div onClick={() => setPage(page === maxPage ? page : page + 1)}>
          <ArrowNext disableButton={page === maxPage ? true : false}>
            <TextPagingNext disableButton={page === maxPage ? true : false}> Next</TextPagingNext>
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0 5C0 5.2652 0.10536 5.5196 0.292892 5.7071L4.29294 9.70714C4.68344 10.0976 5.31664 10.0976 5.70715 9.70714C6.09765 9.31663 6.09765 8.68343 5.70715 8.29292L2.41422 5L5.70715 1.70708C6.09765 1.31655 6.09765 0.68338 5.70715 0.292847C5.31664 -0.0976766 4.68344 -0.0976766 4.29294 0.292847L0.292892 4.29289C0.10536 4.48039 0 4.73479 0 5Z"
              />
            </svg>
          </ArrowNext>
        </div>
      </PageButtons>
    </ListWrapper>
  )
}

export default withRouter(LPList)
