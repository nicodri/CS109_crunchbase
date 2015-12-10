# CS109_crunchbase

As investors we want to know which companies will succeed and which companies will fail so we can make smart investments. Unfortunately there is no way to know ahead of time which companies will succeed or fail, however, we can try to predict success based on the huge amounts of data available online about startups. For this project we will be analyzing data obtained through the CrunchBase API.

# Table of Contents

## Scrapping Notebook
Used to pull data from the CrunchBase API.

## Ensemble Analysis Notebook
Used to analyze the CrunchBase data by building individual Models and combining them into an ensemble.

* [Predicting Startup Success](#Predicting-Startup-Success)
* [1. Data Cleaning](#1.-Data-Cleaning)
* [2. Exploratory Data Analysis](#2.-Exploratory-Data-Analysis)
* [3. Bring out the Models](#3.-Bring-out-the-Models) 
    * [3.1 The Baseline Model](#3.1-The-Baseline-Model)
    * [3.2 K-Nearest Neighbors](#3.2-K-Nearest-Neighbors)
    * [3.3 Logistic Regression](#3.3-Logistic-Regression)
    * [3.4 SVM](#3.4-SVM)
    * [3.5 Naive Bayes](#3.5-Naive-Bayes)
    * [3.6 Random Forests](#3.6-Random-Forests)
* [4. Building an Ensemble](#4.-Building-an-Ensemble)
* [5. ROC/Profit Curves](#5.-ROC/Profit-Curves)

## Similarity Graph Notebook
Used to build a similarity graph of the companies.