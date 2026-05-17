// Utility to send notifications via nfty.sh
import axios from 'axios';

const NFTY_TOPIC = process.env.NFTY_TOPIC; 
const NFTY_URL = `https://ntfy.sh/${NFTY_TOPIC}`;

export async function sendNtfyNotification(message: string) {
  try {
    await axios.post(NFTY_URL, message, {
      headers: {
        'Title': 'Portfolio Lead',
        'Priority': 'urgent',
      },
    });
  } catch (error) {
    console.error('NFTY notification failed:', error);
  }
}
