import { Axios } from "store/reducers/Actions"
import qs from "qs"
import { getSHA256 } from "../../utils"
import { Logo } from "../../images/AWS"

const pushServerPublicKey =
  "BIN2Jc5Vmkmy-S3AUrcMlpKxJpLeVRAfu9WBqUbJ70SJOCWGCGXKY-Xzyh7HDr6KbRDGYHjqZ06OcS3BjD7uAm8"

const { PUBLIC_URL } = process.env

const swUrl = `${PUBLIC_URL}/sw.js`

/**
 * checks if Push notification and service workers are supported by your browser
 */
const isPushNotificationSupported = () =>
  "serviceWorker" in navigator && "PushManager" in window

/**
 * asks user consent to receive push notifications and returns the response of the user, one of granted, default, denied
 */
const askUserPermission = async () => await Notification.requestPermission()

/**
 * shows a notification
 */
const sendNotification = ({
  image = Logo,
  body = "Take a look at this brand new t-shirt!",
  title = "New Product Available",
  tag = "new-product",
  icon = Logo,
  badge = Logo,
}) => {
  const options = {
    body,
    icon,
    vibrate: [200, 100, 200],
    tag,
    image,
    badge,
    actions: [
      {
        action: "Detail",
        title: "View",
        icon: "https://via.placeholder.com/128/ff0000",
      },
    ],
  }
  alert(options)
  navigator.serviceWorker.ready.then((serviceWorker) =>
    serviceWorker.showNotification(title, options)
  )
}

/**
 *
 * using the registered service worker creates a push notification subscription and returns it
 *
 */
const createNotificationSubscription = async () => {
  //wait for service worker installation to be ready
  const serviceWorker = await navigator.serviceWorker.ready
  // subscribe and return the subscription
  return await serviceWorker.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: pushServerPublicKey,
  })
}

/**
 * returns the subscription if present or nothing
 */
const getUserSubscription = () => {
  //wait for service worker installation to be ready, and then
  return navigator.serviceWorker.ready
    .then((serviceWorker) => serviceWorker.pushManager.getSubscription())
    .then(async (pushSubscription) => await getSHA256(pushSubscription))
}

export {
  isPushNotificationSupported,
  askUserPermission,
  sendNotification,
  createNotificationSubscription,
  getUserSubscription,
}
