import React, { useState, useEffect, useRef } from 'react'
import { createChart } from 'lightweight-charts'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { formattedNum } from '../../utils'
import styled from 'styled-components'
import { usePrevious } from 'react-use'
import { Play } from 'react-feather'
import { useMedia } from 'react-use'
import { useDarkModeManager } from '../../contexts/LocalStorage'
import { IconWrapper } from '..'

dayjs.extend(utc)

export const CHART_TYPES = {
  BAR: 'BAR',
  AREA: 'AREA',
}

const Wrapper = styled.div`
  position: relative;
`

// constant height for charts
const HEIGHT = 300

const TradingViewChart = ({
  type = CHART_TYPES.BAR,
  data,
  base,
  baseChange,
  field,
  title,
  width,
  useWeekly = false,
}) => {
  // reference for DOM element to create with chart
  const ref = useRef()

  // pointer to the chart object
  const [chartCreated, setChartCreated] = useState(false)
  const dataPrev = usePrevious(data)
  const below800 = useMedia('(max-width: 800px)')

  useEffect(() => {
    if (data !== dataPrev && chartCreated && type === CHART_TYPES.BAR) {
      // remove the tooltip element
      let tooltip = document.getElementById('tooltip-id' + type)
      let node = document.getElementById('test-id' + type)
      node.removeChild(tooltip)
      chartCreated.resize(0, 0)
      setChartCreated()
    }
  }, [chartCreated, data, dataPrev, type])

  // parese the data and format for tardingview consumption
  const formattedData = data?.map((entry) => {
    return {
      time: dayjs.unix(entry.date).utc().format('YYYY-MM-DD'),
      value: parseFloat(entry[field]),
    }
  })

  // adjust the scale based on the type of chart
  const topScale = type === CHART_TYPES.AREA ? 0.32 : 0.2

  const [darkMode] = useDarkModeManager()
  const textColor = darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(95, 94, 118, 0.7)'
  const colorPrice = darkMode ? 'rgba(255, 255, 255, 0.87)' : '#5F5E76'
  const previousTheme = usePrevious(darkMode)

  // reset the chart if them switches
  useEffect(() => {
    if (chartCreated && previousTheme !== darkMode) {
      // remove the tooltip element
      let tooltip = document.getElementById('tooltip-id' + type)
      let node = document.getElementById('test-id' + type)
      node.removeChild(tooltip)
      chartCreated.resize(0, 0)
      setChartCreated()
    }
  }, [chartCreated, darkMode, previousTheme, type])

  // if no chart created yet, create one with options and add to DOM manually
  useEffect(() => {
    if (!chartCreated && formattedData) {
      var chart = createChart(ref.current, {
        width: width,
        height: HEIGHT,
        layout: {
          backgroundColor: 'transparent',
          textColor: textColor,
        },
        rightPriceScale: {
          scaleMargins: {
            top: topScale,
            bottom: 0,
          },
          borderVisible: false,
        },
        timeScale: {
          borderVisible: false,
        },
        grid: {
          horzLines: {
            color: 'rgba(79, 216, 222, 0.5)',
            visible: false,
          },
          vertLines: {
            color: 'rgba(79, 216, 222, 0.5)',
            visible: false,
          },
        },
        crosshair: {
          horzLine: {
            visible: false,
            labelVisible: false,
          },
          vertLine: {
            visible: true,
            style: 0,
            width: 2,
            color: 'rgba(32, 38, 46, 0.1)',
            labelVisible: false,
          },
        },
        localization: {
          priceFormatter: (val) => formattedNum(val, true),
        },
      })

      var series =
        type === CHART_TYPES.BAR
          ? chart.addHistogramSeries({
            color: '#0085FF',
            priceFormat: {
              type: 'volume',
            },
            scaleMargins: {
              top: 0.32,
              bottom: 0,
            },
            lineColor: '#4FD8DE',
            lineWidth: 3,
          })
          : chart.addAreaSeries({
            topColor: darkMode ? '#132440' : '#dbe9f9',
            bottomColor: darkMode ? '#141c32' : '#fbfcfe',
            lineColor: darkMode ? '#0085FF' : '#0085FF',
            lineWidth: 3,
          })

      series.setData(formattedData)
      var toolTip = document.createElement('div')
      toolTip.setAttribute('id', 'tooltip-id' + type)
      toolTip.className = darkMode ? 'three-line-legend-dark' : 'three-line-legend'
      ref.current.appendChild(toolTip)
      toolTip.style.display = 'block'
      toolTip.style.fontWeight = '500'
      toolTip.style.left = -4 + 'px'
      toolTip.style.top = '-' + 8 + 'px'
      toolTip.style.backgroundColor = 'transparent'

      // format numbers
      let percentChange = baseChange?.toFixed(2)
      let formattedPercentChange = (percentChange > 0 ? '+' : '') + percentChange + '%'
      let color = percentChange > 0 ? '#17C267' : (percentChange < 0 ? '#FF6970' : (darkMode ? 'rgba(255,255,255,0.87)' : '#5F5E76'))

      // get the title of the chart
      function setLastBarText() {
        toolTip.innerHTML =
          `<div style="font-size: 16px; margin: ${below800 ? '-15px 0 5px 7px' : '0 0 5px 30px'}; color: ${textColor};">${title} ${type === CHART_TYPES.BAR && !useWeekly ? '(24hr)' : ''
          }</div>` +
          `<div style="font-size: 24px; margin: ${below800 ? '5px 0 5px 7px' : '5px 0px 5px 30px'}; color:${colorPrice}; font-weight: bold;" >` +
          formattedNum(base ?? 0, true) +
          `<span style="margin-left: 10px; font-size: 16px; color: ${color}; font-weight: 500;">${formattedPercentChange}</span>` +
          '</div>'
      }
      setLastBarText()

      // update the title when hovering on the chart
      chart.subscribeCrosshairMove(function (param) {
        if (
          param === undefined ||
          param.time === undefined ||
          param.point.x < 0 ||
          param.point.x > width ||
          param.point.y < 0 ||
          param.point.y > HEIGHT
        ) {
          setLastBarText()
        } else {
          let dateStr = useWeekly
            ? dayjs(param.time.year + '-' + param.time.month + '-' + param.time.day)
              .startOf('week')
              .format('MMMM D, YYYY') +
            '-' +
            dayjs(param.time.year + '-' + param.time.month + '-' + param.time.day)
              .endOf('week')
              .format('MMMM D, YYYY')
            : dayjs(param.time.year + '-' + param.time.month + '-' + param.time.day).format('MMMM D, YYYY')
          var price = param.seriesPrices.get(series)

          toolTip.innerHTML =
            `<div style="font-size: 16px; margin: 0 0 5px 30px; color: ${textColor};">${title}</div>` +
            `<div style="font-size: 24px; margin: 5px 0px 5px 30px; color: ${colorPrice}; font-weight: bold;">` +
            formattedNum(price, true) +
            '</div>' +
            '<div style="margin-left: 30px">' +
            dateStr +
            '</div>'
        }
      })

      chart.timeScale().fitContent()

      setChartCreated(chart)
    }
  }, [
    base,
    baseChange,
    chartCreated,
    darkMode,
    data,
    formattedData,
    textColor,
    title,
    topScale,
    type,
    useWeekly,
    width,
  ])

  // responsiveness
  useEffect(() => {
    if (width) {
      chartCreated && chartCreated.resize(width, HEIGHT)
      chartCreated && chartCreated.timeScale().scrollToPosition(0)
    }
  }, [chartCreated, width])

  return (
    <Wrapper>
      <div ref={ref} id={'test-id' + type} style={{ marginTop: '30px' }} />
      <IconWrapper style={{ marginRight: '20px' }}>
        <Play
          onClick={() => {
            chartCreated && chartCreated.timeScale().fitContent()
          }}
        />
      </IconWrapper>
    </Wrapper>
  )
}

export default TradingViewChart
