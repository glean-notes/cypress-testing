const MockAudioWorklet = (window: Window) => {
  const anyWindow = window as any
  if (!anyWindow.BaseAudioContext.prototype.hasOwnProperty('audioWorklet')) {
    anyWindow.BaseAudioContext.prototype.audioWorklet = {
      addModule: () => undefined,
    }
  }
}

const MockAudioWorkletNode = (window: Window) => {
  const anyWindow = window as any
  if (typeof anyWindow.AudioWorkletNode !== 'function') {
    anyWindow.AudioWorkletNode = class {
      public port = {
        postMessage: () => undefined,
      }
    }
  }
}

export const ApplyCypressAudioMocks = (window: Window) => {
  MockAudioWorklet(window)
  MockAudioWorkletNode(window)
}
