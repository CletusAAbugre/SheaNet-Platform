import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Sample dataset for Shea Butter production & market trends
data = {
    "Region": [
        "Northern Region", "Upper East Region", "Upper West Region", 
        "Savannah Region", "North East Region"
    ],
    "Shea_Nut_Production_Tons": [50000, 30000, 40000, 35000, 28000],  # In metric tons
    "Shea_Butter_Production_Tons": [12000, 7000, 9000, 8500, 6500],
    "Average_Price_per_Kg": [3.5, 3.8, 3.6, 3.7, 3.9],  # Price in USD per kg
    "Market_Demand_Tons": [10000, 5000, 7000, 6500, 4000],  # Estimated demand
    "Export_Volume_Tons": [6000, 3200, 4000, 3600, 2500]  # Export volume in tons
}

# Convert data into a Pandas DataFrame
df = pd.DataFrame(data)

# Save dataset as CSV for database storage
df.to_csv("shea_market_analysis.csv", index=False)

# Basic Statistics & Insights
print("\n--- Basic Statistics ---")
print(df.describe())

# Correlation Matrix to analyze relationships
plt.figure(figsize=(8, 6))
sns.heatmap(df.corr(), annot=True, cmap="coolwarm", linewidths=0.5)
plt.title("Correlation Matrix of Shea Butter Data")
plt.show()

# Visualizing Shea Butter Production per Region
plt.figure(figsize=(10, 6))
sns.barplot(x=df["Region"], y=df["Shea_Butter_Production_Tons"], palette="viridis")
plt.xlabel("Region")
plt.ylabel("Shea Butter Production (Metric Tons)")
plt.title("Shea Butter Production by Region in Ghana")
plt.xticks(rotation=45)
plt.show()

# Market Demand vs. Export Volume
plt.figure(figsize=(10, 6))
sns.lineplot(x=df["Region"], y=df["Market_Demand_Tons"], marker='o', label="Market Demand", color="blue")
sns.lineplot(x=df["Region"], y=df["Export_Volume_Tons"], marker='s', label="Export Volume", color="red")
plt.xlabel("Region")
plt.ylabel("Volume (Metric Tons)")
plt.title("Market Demand vs. Export Volume per Region")
plt.legend()
plt.xticks(rotation=45)
plt.show()

# Revenue Estimation (Assuming full market demand is met)
df["Projected_Revenue"] = df["Market_Demand_Tons"] * df["Average_Price_per_Kg"]

# Display revenue estimation per region
print("\n--- Projected Revenue per Region (USD) ---")
print(df[["Region", "Projected_Revenue"]])

# Save revenue insights as CSV
df.to_csv("shea_revenue_projection.csv", index=False)
