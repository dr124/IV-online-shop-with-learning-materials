import React, { Component } from 'react';
import {
  CircularProgress,
  Paper,
  Collapse,
  Typography,
  Button,
  Grid
} from '@material-ui/core';
import {
  Card,
  CardBody,
  Input,
  InputGroupAddon,
  InputGroup,
  Label,
  FormGroup,
  Pagination,
  PaginationItem,
  PaginationLink
} from 'reactstrap';

import EnhancedTableToolbar from './TableToolbar';
import NoteService from '../../Services/NoteService';
import queryString from 'query-string';
import './index.scss';
import { SearchNoteCard } from '../NoteCards';

export default class NoteTable extends Component {
  constructor(props) {
    super(props);
    this.toolbarHandler = this.toolbarHandler.bind(this);
  }
  state = {
    q: '',
    loaded: false,
    open: false,
    page: 1,
    size: null,
    notes: [],

    noteData: {
      noteName: '',
      voivodeship: '',
      university: '',
      course: '',
      SortOrder: 'name',
      SortBy: 'asc'
    }
  };

  toolbarHandler = data => {
    data.clicked === this.state.open
      ? this.setState(
          {
            noteData: {
              ...this.state.noteData,
              SortBy: data.sortBy,
              SortOrder: data.sortOrder
            }
          },
          () => this.handleQuery()
        )
      : this.setState({ open: data.clicked });
  };

  componentWillMount() {
    this.handleQuery();
  }

  handleQuery = () => {
    var queryObject = queryString.parse(this.props.query);
    if (this.state.page) queryObject.page = this.state.page;
    if (this.state.size) queryObject.size = this.state.size;
    if (this.state.noteData.SortOrder)
      queryObject.SortOrder = this.state.noteData.SortOrder;
    if (this.state.noteData.SortBy)
      queryObject.SortBy = this.state.noteData.SortBy;

    let query = queryString.stringify(queryObject);
    // window.history.replaceState(null, null, `/search?${query}`);
    window.history.pushState(null, null, `/search?${query}`);

    this.setState({ loaded: false }, () =>
      NoteService.search(queryObject).then(r =>
        this.setState({ ...r, loaded: true })
      )
    );
  };

  handleChange = event => {
    this.setState({
      noteData: {
        ...this.state.noteData,
        [event.target.id]: event.target.value
      }
    });
  };

  changePageTo(p) {
    this.setState(
      {
        page: p
      },
      () => this.handleQuery()
    );
  }

  handlePageCount = event => {
    this.setState(
      {
        size: event.target.value
      },
      () => this.handleQuery()
    );
  };

  renderPagination() {
    const pageSizes = [6, 12, 18, 24];
    const { pager, page } = this.state;
    return (
      <div className="page-manipulator">
        <Pagination className="page-number">
          <PaginationItem className="page-item" disabled={page <= 1}>
            <PaginationLink
              previous
              onClick={() => this.changePageTo(Math.max(page - 1, 1))}
            />
          </PaginationItem>

          {[...Array(pager.pages)].map((x, i) => (
            <PaginationItem
              key={i}
              className="page-item"
              active={page === i + 1}>
              <PaginationLink
                id={i + 1}
                onClick={() => this.changePageTo(i + 1)}>
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem className="page-item" disabled={page >= pager.pages}>
            <PaginationLink
              next
              onClick={() => this.changePageTo(Math.min(page + 1, pager.pages))}
            />
          </PaginationItem>
        </Pagination>
        <Label for="size" className="page-label">
          Ilość wyników na stronę
        </Label>
        <Input
          type="select"
          className="page-size-input"
          id="size"
          defaultValue={12}
          onChange={this.handlePageCount}>
          {pageSizes.map((x, i) => (
            <option value={x} key={i}>
              {x}
            </option>
          ))}
        </Input>
      </div>
    );
  }

  renderFilters() {
    const { open } = this.state;
    return (
      <Collapse in={open}>
        <Card className="filter-list">
          <CardBody>
            <Typography className="filter-header" variant="h6">
              Parametry wyszukiwania
              <Typography variant="caption">
                Wybierz kryteria, na podstawie których chcesz wyszukać notatkę.
              </Typography>
            </Typography>
            <hr />
            <div className="grid-container">
              <div className="filter-left ">
                <Label for="voivodeship">Województwo</Label>
                <InputGroup className="filter-field">
                  <Input
                    id="voivodeship"
                    placeholder="Województwo"
                    onChange={this.handleChange}
                  />
                </InputGroup>

                <Label for="university">Uczelnia</Label>
                <InputGroup className="filter-field">
                  <Input
                    id="university"
                    placeholder="Uczelnia"
                    onChange={this.handleChange}
                  />
                </InputGroup>

                <Label for="course">Kierunek</Label>
                <InputGroup className="filter-field">
                  <Input
                    id="course"
                    placeholder="Kierunek"
                    onChange={this.handleChange}
                  />
                </InputGroup>
              </div>

              <div className="filter-rest">
                <Label for="price-input">Cena</Label>
                <InputGroup className="filter-field rest">
                  <Input
                    id="price-input"
                    placeholder="Od"
                    onChange={this.handleChange}
                  />
                  <InputGroupAddon className="mr-3" addonType="append">
                    PLN
                  </InputGroupAddon>

                  <Input placeholder="Do" onChange={this.handleChange} />
                  <InputGroupAddon addonType="append">PLN</InputGroupAddon>
                </InputGroup>

                <FormGroup className="filter-field rest">
                  <Label for="date-submitted">Data dodania notatki</Label>
                  <Input
                    type="date"
                    id="date-submitted"
                    placeholder="date placeholder"
                  />
                </FormGroup>
                <FormGroup className="filter-field rest">
                  <Label for="author-input">Autor notatki</Label>
                  <Input
                    id="author-input"
                    placeholder="Imię, nazwisko lub nazwa użytkownika"
                    onChange={this.handleChange}
                  />
                </FormGroup>
              </div>
            </div>
            <Button
              variant="outlined"
              className="button"
              onClick={this.handleQuery}
              style={{ marginTop: '20px' }}>
              Szukaj
            </Button>
          </CardBody>
        </Card>
      </Collapse>
    );
  }

  render() {
    const { loaded, notes, pager } = this.state;

    return (
      <div>
        <Paper className="root p-3">
          <EnhancedTableToolbar filterData={this.toolbarHandler} />
          {this.renderFilters()}
          <hr />
          {pager && pager.pages ? this.renderPagination() : ''}
          {loaded ? (
            notes && notes.length ? (
              <Grid container spacing={16}>
                {notes.map((note, i) => (
                  <SearchNoteCard note={note} key={i} />
                ))}
              </Grid>
            ) : (
              <p className="text-center">Nie znaleziono żadnych notatek</p>
            )
          ) : (
            <div className="text-center">
              <CircularProgress />
            </div>
          )}
          <hr />
          {pager && pager.pages ? this.renderPagination() : ''}
        </Paper>
      </div>
    );
  }
}
