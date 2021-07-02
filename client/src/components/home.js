import React, { useState } from "react";

import {
  IconButton,
  Box,
  Toolbar,
  AppBar,
  Typography,
  Container,
  Paper,
  CssBaseline,
  InputBase,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from "@material-ui/core";
import {
  CloseRounded,
  PhotoAlbumRounded,
  SearchRounded,BrightnessHighRounded,Brightness4Rounded
} from "@material-ui/icons";

import { makeStyles,useTheme } from "@material-ui/styles";
import { useSnackbar } from "notistack";

import { ReactComponent as PhotosImg } from "./media/photos.svg";
import { ReactComponent as EmptyImg } from "./media/empty.svg";
import { ReactComponent as ErrorImg } from "./media/error.svg";

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  searchWrapper: {
    paddingLeft: 4,
    flexGrow: 1,
    borderRadius: 50,
    [theme.breakpoints.down("sm")]: {
      minWidth: 300,
    },
    minWidth: 600,
  },
  media: {
    height: 220,
    width: "100%",
  },
  root: {
    borderRadius: 15,
    height: "100%",
  },
  img: {
    height: 200,
    width:200
  },
}));

export default function Home(props) {
  const classes = useStyles();
  const theme=useTheme()
  const {changeTheme} = props

  const [photos, setPhotos] = useState({ data: [] });

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const notify = (msg, variant = "error") => {
    enqueueSnackbar(msg, {
      variant: variant,
      size: "small",
      action: (k) => (
        <IconButton
          onClick={() => {
            closeSnackbar(k);
          }}
          size="small"
        >
          <CloseRounded />
        </IconButton>
      ),
    });
  };

  const onSearchChange = (e) => {
    setPhotos({ ...photos, query: e.target.value });
  };

  const onSearch = (e) => {
    e.preventDefault();

    var q = photos.query;

    if (q == null || q == "") {
      notify("Enter album ID to get album photos");
      return;
    }

    setPhotos({ ...photos, data: [], status: "loading" });

    fetch("http://localhost/api/photos?id=" + q)
      .then(function (response) {
        // The API call was successful!
        return response.json();
      })
      .then(function (data) {
        // This is the JSON from response
        setPhotos({...photos, data: data, status: "success" });
      })
      .catch(function (err) {
        // There was an error loading photos
        setPhotos({...photos, data: [], status: "error" });
        notify('Error loading photos')
      });
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="fixed" color="primary" elevation={0}>
        <Toolbar>
          <Box mr={2}>
            <PhotoAlbumRounded color="inherit" />
          </Box>

          <Typography
            variant="h6"
            color="inherit"
            align="left"
            className={classes.title}
          >
            Album photos
          </Typography>

          <IconButton
            color="inherit"
            onClick={() => changeTheme()}
            style={{ marginRight: 10 }}
          >
            {theme === 1 ? <BrightnessHighRounded /> : <Brightness4Rounded />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        <Box
          mt={13}
          mb={7}
          display="flex"
          flexDirection="column"
          alignItems="center"
          width={1}
        >
          <Box display="flex" justifyContent="center">
            <Paper className={classes.searchWrapper}>
              <form onSubmit={onSearch}>
                <Box display="flex" flexGrow={1}>
                  <InputBase
                    className={classes.input}
                    placeholder="Search album ID"
                    fullWidth
                    onChange={onSearchChange}
                    inputProps={{ "aria-label": "search album id" }}
                  />
                  <IconButton
                    disabled={photos.status === "loading"}
                    size="medium"
                    color="primary"
                    onClick={onSearch}
                  >
                    <SearchRounded />
                  </IconButton>
                </Box>
              </form>
            </Paper>
          </Box>
        </Box>

        {photos.status == null ? (
          <StatusIndicator
            title=" Write album ID and click the button or press enter to get all album
          photos."
            MyImage={PhotosImg}
          />
        ) : photos.status === "loading" ? (
          <StatusIndicator
            title="Loading album photos, please wait..."
            MyImage={null}
          />
        ) : photos.status === "error" ? (
          <StatusIndicator
            title="There is an error while loading album photos, try search again."
            MyImage={ErrorImg}
          />
        ) : photos.data.length === 0 ? (
          <StatusIndicator
            title="No photos found for your album ID, try another ID."
            MyImage={ErrorImg}
          />
        ) : (
          <Grid container spacing={2}>
            {photos.data.map((photo) => (
              <PhotoItem title={photo.title} url={photo.url} key={photo.id} />
            ))}
          </Grid>
        )}
      </Container>
    </React.Fragment>
  );
}

//Photo album single item

function PhotoItem(props) {
  const { title, url } = props;

  const classes = useStyles();

  return (
    <Grid item xs={12} sm={4} md={4}>
      <Card className={classes.root} elevation={0}>
        <img height={80} className={classes.media} src={url} alt={title} />
        <CardContent>
          <Typography color="textSecondary" component="p">
            {title}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}

function StatusIndicator(props) {
  const { title, MyImage } = props;

  const classes = useStyles();

  return (
    <Box
      mt={7}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {MyImage === null ? (
        <CircularProgress />
      ) : (
        <MyImage className={classes.img} />
      )}
      <Box mt={2} />
      <Typography color="textSecondary" align='center'>{title}</Typography>
    </Box>
  );
}
