package com.savannahostrowski.rhododendron;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;


import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.json.*;
import spark.Spark;
import sun.java2d.pipe.SpanShapeRenderer;

import static spark.Spark.*;

public class App {
    private static Connection connection = null;

    public static void main(String[] args) {
        Spark.staticFileLocation("frontend");

        try {
            connection = DriverManager.getConnection("jdbc:sqlite:/home/savannah/Documents/code/limon/movies.db");
            Statement statement = connection.createStatement();
            statement.setQueryTimeout(30);
            System.out.println("Connected to DB successfully");

            statement.executeUpdate("DROP TABLE IF EXISTS symptoms");
            statement.executeUpdate("CREATE TABLE symptoms (date CHAR(8), symptom CHAR(100))");
            System.out.println("DB created");
            System.out.println("DB populated");

        } catch (SQLException e) {
            // if the error message is "out of memory",
            // it probably means no database file is found
            System.err.println(e.getMessage());
        }

        //create endpoints for api
        get("/api/get-historical-symptoms", (req, res) -> {
            Date today = Calendar.getInstance().getTime();
            Calendar oneMonthAgo = Calendar.getInstance();
            oneMonthAgo.setTime(new Date());
            oneMonthAgo.add(Calendar.MONTH, -1);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
            String todayDate = sdf.format(today);
            String oneMonthAgoDate = sdf.format(oneMonthAgo);

            String historicalQuery = "SELECT * FROM symptoms WHERE date between today = ? AND monthAgo = ?";
            PreparedStatement sqlStatement = connection.prepareStatement(historicalQuery);
            sqlStatement.setString(1, todayDate);
            sqlStatement.setString(2, oneMonthAgoDate);

            ResultSet rs = sqlStatement.executeQuery();
            return convertToJson(rs);
        });

        post("/api/add-symptoms", (req, res) -> {
            JSONObject body = new JSONObject(req.body());

            JSONArray symptomData = body.getJSONArray("symptoms");
            ArrayList<String> symptoms = new ArrayList<>();
            for (int i = 0; i < symptomData.length(); i++) {
                String symptom = symptomData.getJSONObject(i).toString();
                symptoms.add(symptom);
            }

            String date = body.getString("date");

            dbInsert(symptoms, date);
            return null;
        });
    }

    private static void dbInsert(ArrayList<String> symptomsJson, String date) throws IOException, SQLException {
        String sqlStatement = "INSERT OR IGNORE INTO movies VALUES(?, ?)";
        PreparedStatement statement = connection.prepareStatement(sqlStatement);
        for (String symptomJson: symptomsJson) {
            statement.setString(1, symptomJson);
            statement.setString(2, date);
            statement.executeUpdate();
        }

    }

    private static String convertToJson(ResultSet rs) {
        ArrayList<String> output = new ArrayList<>();
        try {
            while(rs.next()) {
                output.add(rs.toString());
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        Gson gson = new GsonBuilder().create();
        return gson.toJson(output);
    }

}
