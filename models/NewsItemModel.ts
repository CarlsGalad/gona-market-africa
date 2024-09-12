import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';

interface NewsItem {
  title: string;
  publisher: string;
  datePublished: string;
  content: string;
  image: string;
}

class NewsItemModel implements NewsItem {
  title: string;
  publisher: string;
  datePublished: string;
  content: string;
  image: string;

  constructor({
    title,
    publisher,
    datePublished,
    content,
    image,
  }: NewsItem) {
    this.title = title;
    this.publisher = publisher;
    this.datePublished = datePublished;
    this.content = content;
    this.image = image;
  }

  static fromMap(map: Record<string, unknown>): NewsItemModel {
    const timestamp = map['date_published'] as Timestamp;
    const date = new Date(timestamp.seconds * 1000); // Convert to milliseconds
    const formattedDate = format(date, 'MMMM d, yyyy'); // Format date using date-fns

    return new NewsItemModel({
      title: map['title'] as string,
      publisher: map['publisher'] as string,
      datePublished: formattedDate,
      image: map['image_url'] as string,
      content: map['content'] as string,
    });
  }
}

export default NewsItemModel;
