import { FiMenu, FiMoon, FiSun } from "solid-icons/fi";

export function Navbar() {
  return (
    <div class="navbar bg-base-100 shadow-sm">
      <div class="navbar-start">
        <div class="dropdown">
          <div tabIndex={0} role="button" class="btn btn-ghost btn-circle">
            <FiMenu size={24} />
          </div>
          <ul
            tabIndex="-1"
            class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a href="/">Homepage</a>
            </li>
            <li>
              <a>Portfolio</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="navbar-center">
        <a class="btn btn-ghost text-xl">
          Girls Frontline Mobile Armor Organizer
        </a>
      </div>
      <div class="navbar-end">
        <label class="toggle text-base-content">
          <input type="checkbox" value="sunset" class="theme-controller" />
          <FiSun />
          <FiMoon />
        </label>
      </div>
    </div>
  );
}
