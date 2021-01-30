import { downloadCSV, shareUrl, copyStringToClipboard } from './'
import { getEntryTransform, entryKeyTransform } from 'redux/Entries/utils'
import { mockEntriesWithBadData } from 'redux/testUtils'
import { random, internet, system } from 'faker'

const columns = entryKeyTransform.map(({ key }) => key)
const rows = mockEntriesWithBadData.map(entry => getEntryTransform(entry, false))

const oldWindowUrl = window.URL
const oldWindowNavigator = window.navigator

const oldNavigator = navigator
const mockString = random.word()

let payload

describe('downloadCSV util', () => {
  beforeEach(() => {
    window.navigator.msSaveBlob = undefined
    window.navigator.msSaveOrOpenBlob = undefined
  })

  afterAll(() => {
    window.navigator = oldWindowNavigator
    window.URL = oldWindowUrl
  })

  it('calls window.navigator.msSaveBlob', () => {
    window.navigator.msSaveBlob = jest.fn((blob, fileName) => blob)
    downloadCSV(columns, rows)
    expect(window.navigator.msSaveBlob).toHaveBeenCalledTimes(1)
  })

  it('calls window.navigator.msSaveOrOpenBlob', () => {
    window.navigator.msSaveOrOpenBlob = jest.fn((blob, fileName) => blob)
    downloadCSV(columns, rows)
    expect(window.navigator.msSaveOrOpenBlob).toHaveBeenCalledTimes(1)
  })

  it('calls window.URL.createObjectURL', () => {
    window.URL.createObjectURL = jest.fn(blob => blob)
    downloadCSV(columns, rows)
    expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1)
  })

  it('should download CSV in the right format', () => {
    window.URL.createObjectURL = jest.fn(blob => blob)
    const response = downloadCSV(columns, rows)
    expect(response).toBeDefined()
  })
})

describe('shareUrl util', () => {
  beforeEach(() => {
    payload = {
      url: internet.url(),
      title: random.word(),
      text: random.word(),
    }
    navigator.canShare = jest.fn(payload => !!payload)
    navigator.share = jest.fn(() => Promise.resolve(mockString))
  })

  afterAll(() => {
    navigator = oldNavigator
  })

  it('calls navigator.share', async () => {
    const { data, response } = await shareUrl(payload)

    expect(response).toEqual(mockString)
    expect(data).toMatchObject(payload)
    expect(navigator.canShare).toHaveBeenCalledTimes(0)
    expect(navigator.share).toHaveBeenCalledTimes(1)
  })

  it('does not call navigator.share', async () => {
    navigator.canShare = jest.fn(payload => !payload)
    navigator.share = jest.fn(() => Promise.reject(mockString))

    const { data, error } = await shareUrl(payload)

    expect(error).toEqual(mockString)
    expect(data).toMatchObject(payload)
    expect(navigator.canShare).toHaveBeenCalledTimes(0)
    expect(navigator.share).toHaveBeenCalledTimes(1)
  })

  it('calls navigator.share and shares files', async () => {
    const fileName = system.fileName()
    const fileType = system.commonFileType()
    const fileExt = system.commonFileExt()

    const file = new File([fileName], `${fileName}.${fileExt}`, {
      type: fileType,
    })

    payload.files = [file]

    const { data, response } = await shareUrl(payload)

    expect(response).toEqual(mockString)
    expect(data).toMatchObject(payload)
    expect(navigator.canShare).toHaveBeenCalledTimes(1)
    expect(navigator.share).toHaveBeenCalledTimes(1)
  })
})

describe('copyStringToClipboard util', () => {
  beforeEach(() => {
    navigator.clipboard = {
      writeText: jest.fn(s => Promise.resolve(s)),
    }
  })

  afterAll(() => {
    navigator = oldNavigator
  })

  it('calls navigator.clipboard.writeText', async () => {
    const response = await copyStringToClipboard(mockString)

    expect(response).toEqual(mockString)
    expect(navigator.canShare).toHaveBeenCalledTimes(1)
    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1)
  })
})
