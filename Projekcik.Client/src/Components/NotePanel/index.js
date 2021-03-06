import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  ListItemText,
  Grid
} from '@material-ui/core';
import HrLabel from '../HrLabel/index';
import NoteService from '../../Services/NoteService';
import NotePanelPlaceholder from './NotePanelPlaceholder';
import ReactPlaceholder from 'react-placeholder';
import 'react-placeholder/lib/reactPlaceholder.css';
import './index.scss';
import { BigAddToCartButton } from '../Buttons';
import NotePreview from './notePreview';
import { AuthService } from '../../Services';

export default class NotePanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
    NoteService.getNote(this.props.id).then(r => {
      this.setState({ note: r, loaded: true });
    });
  }

  render() {
    const note = this.state.note;

    return (
      <div>
        <ReactPlaceholder
          ready={this.state.loaded}
          customPlaceholder={<NotePanelPlaceholder />}>
          {this.state.loaded && (
            <div className="note-panel">
              <div className="document-viewer dashboard-wrapper">
                <ol
                  className="breadcrumb clearfiks"
                  itemType="http://schema.org/BreadcrumbList">
                  <li
                    itemType="http://schema.org/ListItem"
                    itemProp="itemListElement">
                    <Link
                      to={{
                        pathname: '/search',
                        search: `?voivodeshipId=${note.voivodeship.id}`
                      }}>
                      <i className="fa fa-globe" />
                      <span itemProp="name">{note.voivodeship.name}</span>
                      <meta content="1" />
                    </Link>
                  </li>
                  <li
                    itemType="http://schema.org/ListItem"
                    itemProp="itemListElement">
                    <Link
                      to={{
                        pathname: '/search',
                        search: `?universityId=${note.university.id}`
                      }}>
                      <i className="fa fa-university" />
                      <span itemProp="name">{note.university.name}</span>
                      <meta content="2" />
                    </Link>
                  </li>
                  <li
                    itemType="http://schema.org/ListItem"
                    itemProp="itemListElement">
                    <Link
                      to={{
                        pathname: '/search',
                        search: `?courseId=${note.course.id}`
                      }}>
                      <i className="fa fa-book" />
                      <span itemProp="name">{note.course.name}</span>
                      <meta content="2" />
                    </Link>
                  </li>
                </ol>

                <Grid container spacing={16}>
                  <Grid item xs={12} sm={6} md={8} lg={8}>
                    <Card className="note-data">
                      <CardContent className="mx-auto">
                        <Typography
                          component="h1"
                          className="title mx-auto"
                          variant="h4"
                          align="center"
                          color="textPrimary"
                          gutterBottom>
                          {note.name}
                        </Typography>
                        <Typography
                          className="subtitle mx-auto"
                          align="center"
                          color="textSecondary"
                          paragraph>
                          {note.description}
                        </Typography>

                        <HrLabel text="Podgląd notatki" />
                        <NotePreview note={note} />
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={4}>
                    <Card className="note-info">
                      {note.author.id !== AuthService.getCurrentUserId() ? (
                        <BigAddToCartButton
                          className="add-to-cart"
                          id={note.id}
                          price={note.price}
                          owned={note.owned}
                        />
                      ) : (
                        <p className="h6 text-center">To twoja notatka</p>
                      )}
                      <div className="note-author">
                        <HrLabel text="Autor" />
                        <Link to={`/user/${note.author.id}`}>
                          <span className="author-name mx-auto">
                            {note.author.name}
                          </span>
                          <div className="author-image">
                            <img
                              className="img-fluid rounded-circle"
                              src="http://placekitten.com/g/100/100"
                              alt="UserPicture"
                            />
                          </div>
                        </Link>
                      </div>
                      <div className="docinfo-full card-row">
                        <HrLabel text="Informacje" />
                        <Grid container spacing={16}>
                          <Grid item xs={4} sm={6} md={12}>
                            <ListItemText
                              className="document-what"
                              primary={[
                                <i className="fa fa-sort-numeric-up" />,
                                'Semestr'
                              ]}
                              secondary={note.semester}
                            />
                          </Grid>
                          <Grid item xs={4} sm={6} md={12}>
                            <ListItemText
                              className="document-what"
                              primary={[
                                <i className="fa fa-globe" />,
                                'Województwo'
                              ]}
                              secondary={note.voivodeship.name}
                            />
                          </Grid>
                          <Grid item xs={4} sm={6} md={12}>
                            <ListItemText
                              className="document-what"
                              primary={[
                                <i className="fa fa-university" />,
                                'Uczelnia'
                              ]}
                              secondary={note.university.name}
                            />
                          </Grid>
                          <Grid item xs={4} sm={6} md={12}>
                            <ListItemText
                              className="document-what"
                              primary={[
                                <i className="fa fa-book" />,
                                'Kierunek'
                              ]}
                              secondary={note.course.name}
                            />
                          </Grid>
                          <Grid item xs={4} sm={6} md={12}>
                            <ListItemText
                              className="document-what"
                              primary={[
                                <i className="fa fa-calendar-plus" />,
                                'Data dodania'
                              ]}
                              secondary={new Date(
                                note.createdAt
                              ).toLocaleDateString()}
                            />
                          </Grid>
                          <Grid item xs={4} sm={6} md={12}>
                            <ListItemText
                              className="document-what"
                              primary={[
                                <i className="fa fa-print" />,
                                'Typ pliku'
                              ]}
                              secondary={note.type}
                            />
                          </Grid>
                        </Grid>
                      </div>
                    </Card>
                  </Grid>
                </Grid>
              </div>
            </div>
          )}
        </ReactPlaceholder>
      </div>
    );
  }
}
