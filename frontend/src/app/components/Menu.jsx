import { useState, useEffect } from "react";
import LocalPizzaOutlinedIcon from "@mui/icons-material/LocalPizzaOutlined";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import CelebrationTwoToneIcon from "@mui/icons-material/CelebrationTwoTone";
import AddIcon from "@mui/icons-material/Add";
import CircularIndeterminate from "./CircularIndeterminate";

const currency = "zł";
const standardSize = "24 cm";
const largeSize = "32 cm";
let standardPriceClasses = "text-sm lg:text-xl text-right font-bold";

async function getMenuItems(selectedMenu) {
  const res = await fetch(
    `http://localhost:1337/api/${selectedMenu}?populate=*`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch pizzas... Please try again later.");
  }

  return res.json();
}

export default function Menu({ selectedMenu }) {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getMenuItems(selectedMenu);

        // if (!data) return <CircularIndeterminate />; TODO: FIX SPINNER

        setMenuItems(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="p-4 bg-stone-900/90 rounded-xl">
      {selectedMenu === "pizzas" && (
        <p className="mb-4 text-md text-right">
          <span>{standardSize} </span>
          <span className="text-stone-500"> / </span>
          <span className="text-orange-500">{largeSize}</span>
        </p>
      )}
      <ul>
        {menuItems.map((item) => (
          <li className="flex items-center gap-2 lg:gap-4 mb-8" key={item.id}>
            {selectedMenu === "pizzas" && <LocalPizzaOutlinedIcon />}
            {selectedMenu === "kebabs" && <CelebrationTwoToneIcon />}
            {selectedMenu === "dodatkis" && <AddIcon />}
            {item.attributes.menuOrder && <span className="text-xs">{item.attributes.menuOrder}.</span>}
            <div className="grow">
              <div className="flex">
                <h4 className="lg:text-xl font-bold text-orange-500">
                  {item.attributes.name}
                </h4>
                {item.attributes.spicy > 0 && (
                  <span className="text-orange-500">
                    &nbsp;
                    {Array.from(
                      { length: item.attributes.spicy },
                      (_, index) => (
                        <LocalFireDepartmentRoundedIcon key={index} />
                      )
                    )}
                  </span>
                )}
                {item.attributes.customLabelAfterName && (
                  <span className="text-orange-500 italic">
                    &nbsp;⌀ {item.attributes.customLabelAfterName}
                  </span>
                )}
                <div className="grow border-b-2 border-dotted border-stone-500"></div>
                <span className={standardPriceClasses}>
                  {item.attributes.price}
                  {selectedMenu !== "dodatkis" && (
                    <span className="text-xs"> {currency}</span>
                  )}
                </span>
                {selectedMenu === "pizzas" &&
                  item.attributes.priceDiff !== 0 && (
                    <span className="lg:text-xl text-stone-500">
                      &nbsp;/&nbsp;
                    </span>
                  )}
                {selectedMenu === "pizzas" &&
                  item.attributes.priceDiff !== 0 && (
                    <span className="lg:text-xl text-orange-500 font-bold">
                      {item.attributes.price + item.attributes.priceDiff}&nbsp;
                      <span className="text-xs">{currency}</span>
                    </span>
                  )}
              </div>

              <span className="text-sm text-stone-400">
                {item.attributes.ingredients}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
