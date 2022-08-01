/* eslint-disable max-classes-per-file,no-shadow */

import 'cypress-file-upload'
import { enableToggle } from 'support/toggles'
import { hideScrollbars, repeat } from 'support/utils'
import { DueDateSelector } from '../components/DueDateSelector'

export const AUDIO_OPTIONS_TOAST_DELAY = 1000
export const EVENT_SCREENSHOT_DELAY = 3000

export enum ShortcutKey {
  HEADING = '1',
  IMPORTANT = '2',
  REVIEW = '3',
  TASK = '4',
}

const getEventName = () => cy.get('.event-name')
export const enterEventName = (name: string) => {
  getEventName().focus().should('have.focus').type(name)

  // Wait for debounced update to IndexedDB
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(500)
}
export const assertEventName = (expectedTitle: string) => getEventName().should('have.value', expectedTitle)
export const assertEventNameFocused = () => getEventName().should('have.focus')

export const stickerTargetTitleFilter = (title: string) => (index: number, el: any) =>
  el.querySelector('title').textContent.indexOf(title) >= 0

export const getAllStickers = () => cy.get('.sticker-target')
export const assertNoStickers = () => getAllStickers().should('not.exist')
export const getStickersBy = (filter: (index: number, el: Node) => boolean) => getAllStickers().filter(filter)
export const getStickersByTitle = (reaction: string) => getStickersBy(stickerTargetTitleFilter(reaction))

export const getTextNotesPage = () => cy.get('.note-entry-with-post-button')
export const getPostButtonAnimation = () => cy.get('.post-button__animation')
export const getTextNotesLabels = () => getTextNotesPage().get('.note-label')
export const getTextNotesDeleteButton = () => getTextNotesPage().getByDataTest('deleteButton')
export const getTextNotesDeleteButtonAnimation = () => getTextNotesPage().getByDataTest('deleteButtonAnimation')
export const clickTextNotesDeleteButton = () => getTextNotesDeleteButton().click()
export const pressTextNotesDeleteButton = () => getTextNotesDeleteButton().focus().type('{enter}')
export const getTextNotesTextArea = () => getTextNotesPage().get('.note-panel__entry-textarea')
export const verifyTextAreaIsEmpty = () => getTextNotesPage().get('.combobox__text-area').should('have.text', '')

export const isTextNotesTextAreaHidden = () =>
  getTextNotesPage().get('.note-panel__entry').invoke('attr', 'aria-hidden')

export const getTextNotesPostButton = () => getTextNotesPage().getByDataTest('postButton')
export const clickTextNotesPostButton = () => getTextNotesPostButton().click()
export const getHeadingButton = () => getTextNotesPage().getByDataTest('headingButton')
export const clickHeadingButton = () => getHeadingButton().click()
export const getLabelButton = (label: string) => getTextNotesLabels().getByDataTest(`label-button-${label}`)
export const clickLabelButton = (label: string) => getLabelButton(label).click()

export const getCursor = () => cy.getByDataTest('AudioCursor.stroke')
export const getCursorPosition = () => getCursor().then((cursorElement) => cursorElement.position())
export const getTraceLine = () => cy.get('.event-visualisation__event-row')
export const getTraceLineWidth = () => {
  getTraceLine().should('have.length', 1)
  getTraceLine().should('be.visible')
  return getTraceLine().then((t) => parseInt(t.attr('x2') || '0', 10) - parseInt(t.attr('x1') || '0', 10))
}

const draftDelete = () => cy.getByDataTest('event-layout-annotation-area').findByDataTest('deleteButton')
export const draftExists = () => {
  getPostButtonAnimation().should('be.visible')
  draftDelete().should('be.visible')
}
export const draftDoesNotExist = () => {
  getPostButtonAnimation().should('not.be.visible')
  draftDelete().should('not.be.visible')
}

export const assertCursorHasMoved = (
  originalPosition: JQuery.Coordinates,
  updatedPosition: JQuery.Coordinates,
  widthToMove: number
) => {
  const xTolerance = 10
  const yTolerance = 1
  const { top: originalTop, left: originalLeft } = originalPosition
  const { top: updatedTop, left: updatedLeft } = updatedPosition

  const yDiff = Math.abs(originalTop - updatedTop)
  expect(yDiff).lessThan(
    yTolerance,
    `Y position not within tolerance. Original: ${originalTop}, updated: ${updatedTop}`
  )

  const howFarRightCursorHasMoved = updatedLeft - originalLeft
  const xDiff = Math.abs(howFarRightCursorHasMoved - widthToMove)
  expect(xDiff).lessThan(
    xTolerance,
    `X position not within tolerance. Original: ${originalLeft}, updated: ${updatedLeft}, traceWidth: ${widthToMove}`
  )
}

// taken from here, awaiting nicer way of checking this: https://github.com/cypress-io/cypress/issues/1750
export const expectPlayingAudio = (playbackRate: number = 1) => {
  cy.get('audio').should((els) => {
    let audible = false
    els.each((i, el) => {
      const untypedEl = el
      if (untypedEl.duration > 0 && !untypedEl.paused && !untypedEl.muted) {
        audible = true
      }
      expect(untypedEl.playbackRate).to.eq(playbackRate)
    })
    expect(audible).to.eq(true)
  })
}

export const expectStopped = () => {
  cy.get('audio').should((els) => {
    let audible = false
    els.each((i, el) => {
      const untypedEl = el
      if (untypedEl.duration > 0 && !untypedEl.paused && !untypedEl.muted) {
        audible = true
      }
    })
    expect(audible).to.eq(false)
  })
}

export const typeTextNote = (text = 'A Text Note') => getTextNotesTextArea().click().should('have.focus').type(text)

export const deleteTextNoteText = () => getTextNotesTextArea().focus().clear()

export const postTextNote = (options: { text?: string; label?: number } = {}) => {
  typeTextNote(options.text)
  if (options.label !== undefined) {
    getTextNotesLabels().eq(options.label).click()
  }

  clickTextNotesPostButton()
}

export const getFeed = () => cy.get('.event-feed-wrapper')
export const assertFeedPresent = () => cy.get('.event-feed-wrapper').should('be.visible')
export const getFeedItems = () => getFeed().get('.feed-item')
const getFeedItemChainable = (itemIndex: number) => getFeedItems().eq(itemIndex)
export const getFeedItem = (itemIndex: number) => new FeedItem(getFeedItemChainable(itemIndex))
export const getFirstFeedItem = () => new FeedItem(getFeedItems().first())
export const clickFirstFeedItem = () => getFeedItems().first().click()
export const getFeedItemLabel = (itemIndex: number) => getFeedItemChainable(itemIndex).find('.note-label')
export const getFeedItemTextArea = (itemIndex: number) => getFeedItemChainable(itemIndex).find('textarea')
export const assertFeedItemText = (itemIndex: number, expectedText: string) =>
  getFeedItemTextArea(itemIndex).should('have.value', expectedText)

export const assertFeedItemExists = (itemIndex: number) => expect(getFeedItem(itemIndex).exists())

export const updateFeedItemText = (itemIndex: number, appendText: string) => {
  getFeedItemTextArea(itemIndex).focus().type('{end}').type(appendText)

  // wait for debounced IDB update
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000)
}

export const waitForFeedItem = (totalItemCount: number) => getFeedItems().should('have.length', totalItemCount)

export const getFeedOverlay = () => cy.get('.feed-overlay')
export const getFeedOverlayLabels = () => getFeedOverlay().find('.note-label')
export const clickHeadingButtonInFeedOverlay = () => getFeedOverlay().findByDataTest('headingButton').click()
export const clickImportantButtonInFeedOverlay = () => getFeedOverlay().findByDataTest('label-IMPORTANT').click()

export const clickRecordDropdown = () => cy.get('.record-control__dropdown-trigger').trigger('click')
export const getMicrophoneRecordDropdownItem = () => cy.getByDataTest('RecordControl.microphoneDropdownItem')
export const assertRecordDropdownMenuOpen = () => getMicrophoneRecordDropdownItem().should('be.visible')
export const assertRecordDropdownMenuClosed = () => getMicrophoneRecordDropdownItem().should('not.be.visible')
export const clickMicrophoneRecordDropdownItem = () => getMicrophoneRecordDropdownItem().trigger('click')

export const clickRecord = () => {
  clickRecordDropdown()
  assertRecordDropdownMenuOpen()
  clickMicrophoneRecordDropdownItem()
  getStopRecordingButton()
  assertPlayButtonNotPresent()
  assertAudioOptionsButtonNotPresent()
  waitForRecordingToStart()
}

export const waitForRecordingToStart = () => {
  cy.get('.record-control__dropdown-trigger__time').should('be.visible')
  cy.get('.record-control__dropdown-trigger__time').should('not.have.text', '00:00')
}

export const getStopRecordingButton = () => cy.getByDataTest('RecordControl.stopButton')

export const getPauseRecordingButton = () =>
  cy.getByDataTest('RecordControl.pauseButton').get('.record-control__dropdown-trigger')

export const clickStopRecording = () => {
  getStopRecordingButton().click({ force: true })
  assertPlayButtonPresent()
  assertAudioOptionsButtonPresent()
}

export const clickPauseRecording = () => {
  getPauseRecordingButton().click({ force: true })
}

export const recordTwoBubblesOfAudio = () => {
  clickRecord()
  stopAfterNBubblesOfAudio(2)
}

export const stopAfterNBubblesOfAudio = (bubbles: number) => {
  waitForBubbles(bubbles)
  clickStopRecording()
  waitForBubbles(bubbles)
}

export const pauseAfterOneBubbleOfAudio = () => {
  waitForBubbles(1)
  clickPauseRecording()
  waitForBubbles(1)
  cy.getByDataTest('RecordControl.recordButtonDropdown').should('be.visible')
}

export const waitForBubbles = (count: number) => {
  findBubbles().should('have.length', count)
}

const getPlayButton = () => cy.getByDataTest('startPlay')
const assertPlayButtonNotPresent = () => getPlayButton().should('not.be.visible')
const assertPlayButtonPresent = () => getPlayButton().should('be.visible')
export const getDisabledPlayButton = () => cy.get('[data-test="startPlay"].button--disabled')
export const getActivePlayButton = () => getDisabledPlayButton().should('not.exist')
export const clickPlay = () => {
  getPlayButton().click()
  cy.getByDataTest('pausePlay')
}

export const clickBackButton = () => {
  cy.runUpdatePersistencePoller()
  cy.getByDataTest('back').click()
}

export const playbackRecordingSegments = (segments = 1) => {
  clickPlay()
  repeat(segments, () => {
    expectPlayingAudio()
    expectStopped()
  })
}

export const type = (character: string) => cy.get('body').type(character, { force: true })
export const shiftDown = () => type('{shift+downArrow}')
export const shiftUp = () => type('{shift+upArrow}')
export const shiftRight = () => type('{shift+rightArrow}')
export const shiftLeft = () => type('{shift+leftArrow}')

export const verifyIsLoaded = () => cy.get('.event-layout[data-test-loading="false"]')

export const getVisualisation = () => cy.get('.event-layout__visualisation')
export const findBubbles = () => getVisualisation().find('[data-test="Bubble.isComplete"]')
export const getBubbleCount = () => findBubbles().its('length')
export const assertVisualisationPresent = () => cy.get('.event-layout__visualisation').should('be.visible')
export const assertVisualisationNotPresent = () => cy.get('.event-layout__visualisation').should('not.exist')

export const findAudioSection = () => cy.get('.audio-visualisation__section')

export const readingViewButton = () => cy.getByDataTest('reading-view-link')
export const clickReadingViewButton = () => {
  readingViewButton().click()
}
export const lightningModeButton = () => cy.getByDataTest('lightning-mode-toggle')
export const clickLightningModeButton = () => lightningModeButton().click()

export const clickCopy = () => cy.getByDataTest('copy-event-to-clipboard-button').click()
export const verifyCopySuccessToastIsShown = () => cy.get('#copyButtonToast')

export const assertExpandViewIsVisible = () => cy.getByDataTest('feed-item-expanded-view')
export const assertExpandViewNoteText = (expectedText: string) =>
  cy.getByDataTest('feed-item-expanded-view-text').should('have.value', expectedText)
export const closeExpandView = () => cy.getByDataTest('feed-item-expanded-view-close').click()

export const assertStickerCount = (reaction: string, expected: number) => {
  return getStickersByTitle(reaction).should(($reactions) => expect($reactions).to.have.length(expected))
}

export const verifyDefinitionNotPosted = () => cy.getByDataTest('definition-card-search-modal-no-match')

export const postHeading = (text: string) => {
  clickHeadingButton()
  typeTextNote(text)
  clickTextNotesPostButton()
}
export const getAudioVisHeading = (itemIndex: number) =>
  getVisualisation().get('.audio-visualisation__heading-level-card').eq(itemIndex)
export const typeAudioVisHeadingText = (itemIndex: number, text: string) =>
  getAudioVisHeading(itemIndex).focus().type('{end}').type(text)
export const assertAudioVisHeadingText = (itemIndex: number, expectedText: string) =>
  getAudioVisHeading(itemIndex).should('have.value', expectedText)

export const logInAndVisitEvent = (username: string, eventId: string) => {
  cy.login(username)
  cy.visit(`/event/${eventId}`)
  verifyIsLoaded()
}

export const clickEventOptionsMenu = () => cy.getByDataTest('EventMenu.menu').click()
export const clickDeleteEvent = () => {
  cy.getByDataTest('DeleteEvent').click()
  cy.getByDataTest('ConfirmDeleteEventModal-delete').click()
}

export const clickDeleteSlides = () => {
  cy.getByDataTest('DeleteSlidesDropdown.dropdownItem').click()
  cy.getByDataTest('DeleteSlidesDropdown.confirm').click()
}

export const clickEventLayoutOptionsMenu = () => cy.getByDataTest('layout-options-menu').click()
export const toggleHideAudioWhenRecording = () => cy.getByDataTest('layoutOptionItem-hideAudioWhenRecording').click()

export const clickRecordFromScreenAudio = () => {
  cy.getByDataTest('RecordControl.screenAudioDropdownItem').click()
}

export const clickRecordFromScreenAudioAndMic = () => {
  cy.getByDataTest('RecordControl.screenAudioAndMicDropdownItem').click()
}

export const importImage = () => {
  cy.getByDataTest('imageButton').click()
  cy.getByDataTest('ImageSearchModal.import').click()

  cy.fixture('test.jpeg', 'base64').then((fileContent) => {
    cy.getByDataTest('ImageSearchModal.fileInput').first().upload({
      fileContent,
      fileName: 'test.jpeg',
      mimeType: 'image/jpeg',
      encoding: 'base64',
    })
  })
}

export const clickPostImageButton = () => {
  cy.getByDataTest('imageButton').click()
}

export const verifyImageSearchShown = () => {
  cy.getByDataTest('ImageSearchModal.modal').should('be.visible')
}

export const verifyImportingPowerpointModalIsShown = () => cy.getByDataTest('importing-powerpoint')
export const verifyImportingPowerpointModalIsNotShown = () =>
  cy.getByDataTest('importing-powerpoint', { timeout: 180000 }).should('not.exist')

export const dragAndDropSlideFile = (fileName: string, mimeType: string) => {
  cy.fixture(fileName, 'base64').then((fileContent) => {
    cy.getByDataTest('dropzone').upload(
      { fileContent, fileName, mimeType, encoding: 'base64' },
      { subjectType: 'drag-n-drop' }
    )
  })
}

export const getPostSlideButton = () => cy.get('.pdf-slide-picker__add-slide')
export const clickPostSlideButton = () => getPostSlideButton().click()
export const verifyPostSlideButtonText = (text: string) => getPostSlideButton().should('contain', text)
export const clickNextSlideButton = () => cy.get('.pdf-slide-picker__next-page').click()
export const getRevertSlideButton = () => cy.get('.pdf-slide-picker__revert-slide')
export const clickRevertSlideButton = () => getRevertSlideButton().click()

const slidePicker = () => cy.get('.pdf-slide-picker')
export const verifySlidePickerIsVisible = () => slidePicker().should('be.visible')
export const verifySlidePickerNotExist = () => slidePicker().should('not.exist')

export const verifySlideSelected = (slideIndex: number) =>
  cy.getByDataTest('pdf-interaction-overlay-page-number').contains(`${slideIndex} /`)

export const verifyPdfPaginationShown = () =>
  cy.getByDataTest('pdf-interaction-overlay-page-number').should('be.visible')

export const verifyPdfExpandMessageShown = () =>
  cy.getByDataTest('pdf-interaction-overlay-expand-message').should('be.visible')

export const focusPdfNextSlideButton = () => cy.get('.pdf-slide-picker__next-page').focus().should('have.focus')

const pdfOverlay = () => cy.getByDataTest('pdf-interaction-overlay')
const minimiseSlidesButton = () => cy.get('.pdf-slide-picker__close-expanded-slides-button')

export const expandSlides = () => {
  clickSlideInteractionOverlay()
}

export const minimiseSlides = () => {
  minimiseSlidesButton().click()
}

const assertFeedAndVisualisationPresent = () => {
  assertFeedPresent()
  assertVisualisationPresent()
}

export const verifySlidesExpanded = () => {
  minimiseSlidesButton().should('be.visible')
}

export const verifySlidesNotExpanded = () => {
  minimiseSlidesButton().should('not.exist')
  assertFeedAndVisualisationPresent()
}

export const getEventId = () =>
  cy.url().then((url) => {
    const eventId = url.split('/').pop()!
    cy.wrap(eventId).as('eventId')
  })

export const verifySlidesLoaded = () => cy.get('.canvas').should('be.visible')

export const clickSlideInteractionOverlay = () => pdfOverlay().click()

export const clickDropdownSendACopy = () => {
  cy.get('.dropdown-menu--active').contains('Send a Copy').click()
}

const minimiseImageButton = () => cy.get('.event-layout-expanded-image__close-button')

export const closeEnlargedImageView = () => minimiseImageButton().click({ force: true })

export const verifyImageEnlarged = () => {
  minimiseImageButton().should('be.visible')
}

export const verifyImageNotEnlarged = () => {
  minimiseImageButton().should('not.exist')
  assertFeedAndVisualisationPresent()
}

export const clickDropdownInviteToEvent = () => {
  cy.get('.dropdown-menu--active').contains('Invite to Event').click()
}

export const verifyInviteToEventNotVisible = () => {
  cy.get('.dropdown-menu--active').contains('Invite to Event').should('not.exist')
}

/**
 * Hover helpers
 */
export const hoverVisualisation = (x: number) =>
  findAudioSection().first().trigger('mousemove', x, 30, { force: true, offsetX: x, offsetY: 30 })

export const verifyHoverVisible = () => {
  cy.get('.hover-sticker').should('exist')
}
export const verifyHoverNotVisible = () => {
  cy.get('.hover-sticker').should('not.exist')
}

export class FeedItem {
  constructor(private item: Chainable<JQuery<HTMLElement>>) {}

  public focus() {
    return this.item
  }

  public type(character: string) {
    return this.item.find('.feed-item-text-area').type(character)
  }

  public getDueDateSelector() {
    return new DueDateSelector(this.item)
  }

  public getPlayButton(extraSelector = '') {
    return this.focus().find(`[data-test="playButton"]${extraSelector}`)
  }

  public getTimeStamp() {
    return this.focus().findByDataTest('feed-item-time-stamp')
  }

  public hasTimeStamp(timestamp: string) {
    this.getTimeStamp().should('contain', timestamp)
  }

  public clickExpandButton() {
    return this.focus().findByDataTest('toggle-single-note-view').click({ force: true })
  }

  public clickEnlargeImageButton() {
    return this.focus().findByDataTest('feed-item-enlarge').click({ force: true })
  }

  public clickCompleteTaskCheckbox() {
    return this.focus().findByDataTest('task-card-complete-checkbox').click({ force: true })
  }

  public clickPostTextFromSlideButton() {
    return this.focus().findByDataTest('feed-item-post-text-from-slide').click({ force: true })
  }

  public assertCanPlay() {
    return this.getPlayButton('[aria-disabled="false"]').should('not.be.empty')
  }

  public assertCannotPlay() {
    return this.getPlayButton('[aria-disabled="true"]').should('not.be.empty')
  }

  public assertIsSelected() {
    this.item.should('have.class', 'feed-item--selected')
  }

  public clickLabel() {
    this.item.find('.note-label').click({ force: true })
  }

  public click() {
    this.item.click()
  }

  public verifyIsHeading() {
    this.item.should('have.class', 'feed-item--heading')
  }

  public verifyIsSlide() {
    this.item.should('have.class', 'feed-item--slide')
  }

  public verifyIsImage() {
    this.item.should('have.class', 'feed-item--image')
  }

  public verifyIsTextNote() {
    this.item.should('have.class', 'feed-item--text-note')
  }

  public verifyIsDefinition() {
    this.item.should('have.class', 'feed-item--definition')
  }

  public verifyIsTask() {
    this.item.should('have.class', 'feed-item--task-card')
  }

  public verifyLabel(label: 'Important' | 'Heading' | 'Review' | 'Task' | 'No label') {
    this.item.find('.note-label').should('have.attr', 'title').and('contains', label)
  }

  public verifyContainsText(text: string) {
    this.item.find('.feed-item-text-area').should('contain', text)
  }

  public verifyDefinitionContainsText(text: string) {
    this.item.findByDataTest('DefinitionCard.extract').should('contain', text)
  }

  public verifyTaskContainsText(text: string) {
    this.item.find('.task-card__text-area').should('contain', text)
  }

  public verifyTaskCompleteChecked() {
    this.item.find('.task-card__complete-checkbox').should('have.attr', 'aria-checked', 'true')
  }

  public verifyTaskCompleteNotChecked() {
    this.item.find('.task-card__complete-checkbox').should('have.attr', 'aria-checked', 'false')
  }

  public exists = () => this.item !== undefined

  public cards = () => this.item.find('.feed-item-card__wrapper')
  public getCardElement = (index: number) => this.cards().eq(index)
  public getCard = (index: number) => new Card(this.getCardElement(index))

  public delete = () => this.item.findByDataTest('feed-item-delete').click()
  public openContextMenu = () => this.item.findByDataTest('annotation-menu').click()
  public deleteInMultiCard = () => {
    this.openContextMenu()
    this.item.findByDataTest('delete-annotation').click()
  }

  public convertToTask = () => {
    this.openContextMenu()
    this.item.findByDataTest('convert-to-task').click()
  }

  public convertToNote = () => {
    this.openContextMenu()
    this.item.findByDataTest('convert-to-note').click()
  }

  public addEmptyTextCard = () => {
    this.item.click()
    this.item.findByDataTest('feed-item-add-card').click()
  }
}

class Card {
  constructor(private item: Chainable<JQuery<HTMLElement>>) {}

  private dropdown = () => this.item.getByDataTest('card-menu')
  private openDropdown = () => this.performAction(() => this.dropdown().click())

  private dropdownItem = (testId: string) => {
    this.openDropdown()
    return this.item.getByDataTest(testId)
  }

  public convertToHeadingButton = () => this.dropdownItem('convert-to-heading')
  public convertToTaskButton = () => this.dropdownItem('convert-to-task')
  public convertToNoteButton = () => this.dropdownItem('convert-to-note')
  public deleteButton = () => this.dropdownItem('delete-card')

  public clickConvertToHeading = () => this.performAction(() => this.convertToHeadingButton().click())
  public clickConvertToTask = () => this.performAction(() => this.convertToTaskButton().click())
  public clickConvertToNote = () => this.performAction(() => this.convertToNoteButton().click())

  public hasText = (text: string) => this.item.should('contain.text', text)
  public type = (text: string) => this.item.type(text)

  public verifyDefinitionContainsText = (text: string) =>
    this.item.findByDataTest('DefinitionCard.extract').should('contain', text)

  public verifyTaskContainsText = (text: string) => this.item.find('.task-card').should('contain', text)

  public verifyIsImage = () => this.item.findByDataTest('feed-item-image-card').should('exist')

  public clickDefinitionButton = () =>
    this.performAction(() => this.item.find('[data-test="definitionButton"]:visible').click())
  public clickTaskButton = () => this.performAction(() => this.item.find('[data-test="task-button"]:visible').click())
  public clickImageButton = () => this.performAction(() => this.item.find('[data-test="imageButton"]:visible').click())

  private performAction = <T>(action: () => T) => {
    this.item.click()
    return action()
  }

  public getDragHandle = () =>
    this.performAction(() =>
      this.item.findByDataTest('reorder-card-drag-handle').find('.glean-icon__container:visible')
    )

  public enlargeImage = () => this.item.findByDataTest('feed-item-enlarge').click()
}

/*
  ActionCommandPopup helpers
 */
export const verifyListNotVisible = () => {
  cy.get('.combobox__list').should('not.exist')
}
export const verifyListVisible = () => {
  cy.get('.combobox__list').should('exist')
}
export const selectActionCommand = (text: string) => {
  cy.get('.combobox__list-item').contains(text).click()
}

export const getAudioOptionsButton = () => cy.get('.audio-options__trigger')
export const assertAudioOptionsButtonFocused = () => getAudioOptionsButton().should('have.focus')
export const assertAudioOptionsButtonPresent = () => getAudioOptionsButton().should('be.visible')
export const assertAudioOptionsButtonNotPresent = () => getAudioOptionsButton().should('not.be.visible')
export const getDisabledAudioOptionsButton = () => cy.get('.audio-options__trigger.button--disabled')
export const getActiveAudioOptionsButton = () => getDisabledAudioOptionsButton().should('not.exist')

export const assertAudioOptionsButtonPlaybackRate = (playbackRate: number) =>
  getAudioOptionsButton().should('have.text', `${playbackRate}×`)
export const clickAudioOptionsButton = () => getAudioOptionsButton().click()

export const assertAudioOptionsMenuVisible = () => cy.get('.audio-options__menu').should('be.visible')
export const assertAudioOptionsMenuNotVisible = () => cy.get('.audio-options__menu').should('not.visible')

export const expectModalOpen = () => cy.get('.ReactModalPortal .ReactModal__Content').should('be.visible')
export const expectModalClosed = () => cy.get('.ReactModalPortal .ReactModal__Content').should('not.exist')

export const clickFocusTimerToolbarButton = () => {
  cy.getByDataTest('focus-timer-button').click()
}
export const advanceTimeByOneHour = () => cy.clock(Date.now()).tick(60 * 60 * 1000)
export const expectFocusTimerCountdownStarted = () => cy.get('.countdown__remaining-time').should('be.visible')
export const expectFocusTimerCountdownExpired = () => cy.get('.countdown__remaining-time').should('not.exist')
export const expectFocusTimerAchievementSummaryDisplayed = () =>
  cy.get('.start-again-button__popover').should('be.visible')
export const hideFeedScrollbar = () => hideScrollbars('.event-feed')

export const focusTimerNotesCreatedSummaryShouldBe = (text: string) =>
  cy.getByDataTest('notes-created').should('have.text', text)

export const getUrlPreviewIcon = () => cy.get('.url-preview__icon')
export const getUrlPreviewSiteName = () => cy.get('.url-preview__site-name')
export const getUrlPreviewTitle = () => cy.get('.url-preview__title')
export const getUrlPreviewDescription = () => cy.get('.url-preview__description')
export const getUrlPreviewImage = () => cy.get('.url-preview__image')

export const clickScreenshot = () => cy.getByDataTest('screenshot-button').click()
export const getDragHandle = (index: number = 0) => cy.getByDataTest('reorder-card-drag-handle').eq(index)

export const verifyConvertButtonExists = () => getConvertButton().should('exist')
export const verifyConvertButtonDoesNotExist = () => getConvertButton().should('not.exist')

export const getConvertButton = () => cy.getByDataTest('convertButton')
export const clickConvertButton = () => {
  cy.intercept('POST', '**/transcription-job').as('postTranscriptionJob')
  getConvertButton().click()
  cy.wait('@postTranscriptionJob')
}

export const getConversionSpinner = () => cy.getByDataTest('EventLayoutVisualisationHeader.spinner')

export const verifyConversionSpinnerExists = () => getConversionSpinner().should('exist')
export const verifyConversionSpinnerDoesNotExist = () => getConversionSpinner().should('not.exist')

export const conversionPopup = () => cy.get('.event-layout-visualisation-header__progress-popup')

export const verifyConversionPopupVisible = () => conversionPopup().should('be.visible')
export const verifyConversionPopupNotVisible = () => conversionPopup().should('not.exist')

export const audioVisualisationButton = (timeout?: number) => cy.getByDataTest('AudioTabButton', { timeout })
export const textVisualisationButton = (timeout?: number) => cy.getByDataTest('TextTabButton', { timeout })

export const clickTextVisualisationButton = () => textVisualisationButton().click()

export const postTextPopover = () => cy.getByDataTest('post-text-popover')

export const postTextPopoverButton = () => cy.getByDataTest('post-button')

export const clickPostTextPopoverButton = () => postTextPopoverButton().click()
export const textVisualisationContainer = () => cy.getByDataTest('text-visualisation__transcription-text-container')

export const textVisualisationContainerShouldBeVisible = () => textVisualisationContainer().should('be.visible')

export const verifyAudioVisualisationButtonVisible = (timeout?: number) =>
  audioVisualisationButton(timeout).should('be.visible')
export const verifyTextVisualisationButtonVisible = (timeout?: number) =>
  textVisualisationButton(timeout).should('be.visible')
export const verifyPostTextPopoverVisible = () => postTextPopover().should('be.visible')

export const verifyPostTextPopoverButtonExists = () => postTextPopoverButton().should('exist')
export const verifyPostTextPopoverButtonVisible = () => postTextPopoverButton().should('be.visible')

export const selectTranscriptionText = () => {
  textVisualisationContainer().then((transcriptionContainer) => {
    return cy
      .window()
      .then((window) => {
        const transcriptionContainerDiv = transcriptionContainer.get(0)
        const selection = window.getSelection()
        const range = window.document.createRange()
        range.setStart(transcriptionContainerDiv, 16)
        range.setEnd(transcriptionContainerDiv, 46)
        selection?.removeAllRanges()
        selection?.addRange(range)
      })
      .then(() => {
        textVisualisationContainer().first().trigger('mouseup', 'topLeft', { which: 1 })
      })
  })
}

export const postNewAnnotationWithExtraEmptyTextCard = (text: string = '1st Card') => {
  enableToggle('multiCard')

  postTextNote({ text })
  getFeedItems().should('have.length', 1)
  getFirstFeedItem().addEmptyTextCard()
}
export const postNewAnnotation2Cards = (text1: string = '1st Card', text2: string = '2ndCard') => {
  enableToggle('multiCard')

  postTextNote({ text: text1 })
  getFeedItems().should('have.length', 1)

  getFirstFeedItem().addEmptyTextCard()

  cy.focused().type(`${text2}{enter}`)
  getFirstFeedItem().cards().should('have.length', 2)
}

const singleNoteView = () => cy.getByDataTest('SingleNoteView')
export const verifySingleNoteViewExists = () => singleNoteView().should('exist')
export const verifySingleNoteViewNotExists = () => singleNoteView().should('not.exist')
export const closeSingleNoteView = () => cy.getByDataTest('toggle-single-note-view').click()
export const clickNextNoteOnSingleNoteView = () => cy.getByDataTest('next-card').click()
export const clickPreviousNoteOnSingleNoteView = () => cy.getByDataTest('previous-card').click()
export const singleNoteViewCards = () => singleNoteView().get('.feed-item-card')

interface SingleNoteViewContains {
  cardCount: number
  shouldNotContain: string
  shouldContain: string
}

export const assertSingleView = ({ cardCount, shouldContain, shouldNotContain }: SingleNoteViewContains) => {
  singleNoteViewCards().should('have.length', cardCount)
  singleNoteViewCards().should('contain', shouldContain)
  singleNoteViewCards().should('not.contain', shouldNotContain)
}

export const visualisationScroller = () => cy.getByDataTest('auto-scroller')

export const scrollVisualisationDown = () => cy.getByDataTest('scroll-down')

export const visualisationIsScrolledToTop = () =>
  visualisationScroller().then(($element) => {
    expect($element.scrollTop()).eq(0)
  })

export const visualisationIsNotScrolledToTop = () =>
  visualisationScroller().then(($element) => {
    expect($element.scrollTop()).not.eq(0)
  })
