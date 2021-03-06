const worker = new Worker('worker.js')
const $singlePic = document.querySelector('#single-pic')
const $multiPic = document.querySelector('#multi-pic')
const $dynamicPic = document.querySelector('#dynamic-pic')

$singlePic.onchange = (e) => {
  const files = e.target.files
  worker.postMessage({
    files,
    arguments: [
      '-i', '/input/' + files[0].name,
      '-ss', '00:00:05',
      '-vframes', '1',
      '-q:v', '2',
      '/output/01.jpg'
    ],
  })
}

$multiPic.onchange = (e) => {
  const files = e.target.files
  worker.postMessage({
    files,
    arguments: [
      '-i', '/input/' + files[0].name,
      '-y',
      '-f', 'image2',
      '-vf', 'fps=fps=1',
      '/output/prefix_%03d.jpeg'
    ]
  })
}

$dynamicPic.onchange = (e) => {
  const files = e.target.files
  worker.postMessage({
    files,
    arguments: [
      '-i', '/input/' + files[0].name,
      '-ss', '00:00:02',
      '-t', '3',
      '-s', '360x640',
      '-r', '15',
      '/output/foo.gif'
    ]
  })
}

worker.addEventListener('message', e => {
  const resList = e.data
  const wrapper = document.createElement('div')
  for (let i = 0; i < resList.length; i++) {
    const arryBuffer = resList[i].data
    const src = arrayBufferToBase64(arryBuffer)
    const img = document.createElement('img')
    img.src = 'data:image/png;base64,' + src
    img.width = 100
    wrapper.appendChild(img)
  }
  document.body.appendChild(wrapper)
})

function arrayBufferToBase64(buffer) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}