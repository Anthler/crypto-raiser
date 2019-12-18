import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Web3 from "web3";
import FundraiserContract from "../contracts/FundraiserContract.json";

const useStyles = makeStyles({
    card: {
    maxWidth: 450,
    height: 400
    },
    media: {
    height: 140,
    },
    });